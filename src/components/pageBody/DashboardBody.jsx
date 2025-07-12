import React, { useState, useEffect, useRef } from "react";
import AddPersonnelModal from "../modal/addPersonnelModal";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase/Firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import HeaderSection from "../header/HeaderSection";
import OverviewCard from "../DashboardCard/OverViewCard";
import ProfileCard from "../DashboardCard/ProfileCard";
import BodyCard from "../parentCard/BodyCard";
import DashboardChart from "../chart/DashboardChart";
import Firefighters from "./dashboardAssets/firefighters.png";
import BarangayChart from "../chart/BarangayChart";

function DashboardBody() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // at the top of DashboardBody()
  const [topBarangay, setTopBarangay] = useState({
    name: "",
    count: 0,
    monthLabel: "",
  });

  // State for the analytics data which includes our realTimeData and personnel info (if needed)
  const [analyticsData, setAnalyticsData] = useState({
    realTimeData: [],
    notifications: [],
    personnelInfo: {},
  });

  const { severity, activeSensorNames } = calculateAlertSeverityRatio(
    analyticsData.notifications
  );
  const fetchedOnceRef = useRef(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchTopBarangayForLatestMonth = async () => {
    try {
      const snapshot = await getDocs(collection(db, "personnelRecords"));
      const records = snapshot.docs.map((doc) => {
        const data = doc.data();
        const date = data.date?.seconds
          ? new Date(data.date.seconds * 1000)
          : new Date(data.date);
        return {
          location: data.location || "Unknown",
          year: date.getFullYear(),
          month: date.getMonth(), // 0 = Jan
        };
      });

      if (records.length === 0) return;

      // 1) Group records by "YYYY‑MM"
      const byPeriod = records.reduce((acc, { location, year, month }) => {
        const key = `${year}-${month}`;
        acc[key] = acc[key] || [];
        acc[key].push(location);
        return acc;
      }, {});

      // 2) Find the latest period key
      const latestKey = Object.keys(byPeriod)
        .sort((a, b) => new Date(a + "-01") - new Date(b + "-01"))
        .pop();

      // 3) Count per barangay in that period
      const counts = byPeriod[latestKey].reduce((acc, loc) => {
        acc[loc] = (acc[loc] || 0) + 1;
        return acc;
      }, {});

      // 4) Pick the top
      const [name, count] = Object.entries(counts).sort(
        ([, a], [, b]) => b - a
      )[0];

      // 5) Format month label (e.g. “June 2025”)
      const [yy, mm] = latestKey.split("-").map(Number);
      const monthLabel = new Date(yy, mm).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      setTopBarangay({ name, count, monthLabel });
    } catch (err) {
      console.error("Error fetching top barangay:", err);
    }
  };

  useEffect(() => {
    if (!fetchedOnceRef.current) {
      fetchPersonnelData();
      fetchLatestRealTimeData();
      fetchTopBarangayForLatestMonth();
      fetchedOnceRef.current = true;
    }
  }, []);

  // Function to fetch personnel data from Firestore
  const fetchPersonnelData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "personnelInfo"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPersonnel(data);
    } catch (error) {
      console.error("Error fetching personnel data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the single most recent personnelRecord, then its realTimeData & notifications
  const fetchLatestRealTimeData = async () => {
    try {
      // 1) Query personnelRecords sorted by date descending, and limit to 1
      const personnelRecordsQuery = query(
        collection(db, "personnelRecords"),
        orderBy("date", "desc"),
        limit(1)
      );
      const personnelSnapshot = await getDocs(personnelRecordsQuery);

      if (!personnelSnapshot.empty) {
        // We know there's exactly one doc here
        const latestDoc = personnelSnapshot.docs[0];
        console.log("Latest personnel record:", latestDoc.id, latestDoc.data());

        // 2) Fetch its realTimeData subcollection
        const realTimeDataSnapshot = await getDocs(
          collection(db, "personnelRecords", latestDoc.id, "realTimeData")
        );
        const realTimeData = realTimeDataSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 3) Fetch its notifications subcollection
        const notificationSnapshot = await getDocs(
          collection(db, "personnelRecords", latestDoc.id, "notifications")
        );
        const notificationsData = notificationSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 4) Update your state with the most recent data
        setAnalyticsData({
          realTimeData,
          notifications: notificationsData,
          personnelInfo: latestDoc.data(),
        });
      } else {
        console.log("No personnel records found.");
      }
    } catch (error) {
      console.error("Error fetching latest real time data:", error);
    }
  };

  // Image carousel logic for the ProfileCard.
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % personnel.length);
  };

  // Previous image logic
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? personnel.length - 1 : prevIndex - 1
    );
  };

  // Function to fetch image URL from Firebase Storage
  const fetchImageUrl = async (imagePath) => {
    console.log("Fetching image for path:", imagePath);
    const storage = getStorage();
    const imageRef = ref(storage, imagePath);
    try {
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error("Error fetching image from Firebase Storage:", error);
      return "https://via.placeholder.com/300x300";
    }
  };

  function calculateAlertSeverityRatio(notifications) {
    const sorted = (notifications || []).slice().sort((a, b) => {
      const ta = a.timestamp?.seconds
        ? a.timestamp.seconds * 1000
        : new Date(a.timestamp).getTime();
      const tb = b.timestamp?.seconds
        ? b.timestamp.seconds * 1000
        : new Date(b.timestamp).getTime();
      return ta - tb;
    });

    let severity = 0;
    const activeSensors = new Set();

    sorted.forEach((notification) => {
      let weight = 0;
      switch (notification.sensor) {
        case "Carbon Monoxide":
        case "Body Temperature":
        case "Smoke":
        case "Environmental Temperature":
          weight = 25;
          break;
        default:
          return;
      }

      if (notification.isCritical) {
        if (!activeSensors.has(notification.sensor)) {
          activeSensors.add(notification.sensor);
          severity += weight;
        }
      } else {
        if (activeSensors.has(notification.sensor)) {
          activeSensors.delete(notification.sensor);
          severity -= weight;
        }
      }
    });

    return {
      severity: Math.max(0, severity),
      activeSensorNames: Array.from(activeSensors),
    };
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full border-t-2 border-b-2 border-bfpNavy h-14 w-14"></div>
      </div>
    );
  }

  if (personnel.length === 0) {
    return <p>No personnel data found.</p>;
  }

  // Sort notifications from latest to outdated
  const sortedNotifications = analyticsData.notifications.sort((a, b) => {
    const dateA = a.timestamp.seconds
      ? new Date(a.timestamp.seconds * 1000)
      : new Date(a.timestamp);
    const dateB = b.timestamp.seconds
      ? new Date(b.timestamp.seconds * 1000)
      : new Date(b.timestamp);
    return dateB - dateA;
  });

  return (
    <div className="p-2 h-full flex flex-col bg-white font-montserrat">
      <HeaderSection title="DASHBOARD" />

      <div className="my-2 h-[3px] bg-separatorLine w-[80%] mx-auto" />

      {/* Parent Card */}
      <BodyCard>
        <div className="grid gap-4 sm:gap-2">
          {/* First row: DashboardChart & BarangayChart side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="w-full">
              <BarangayChart
                dateTime={
                  analyticsData.realTimeData.length > 0
                    ? analyticsData.realTimeData[0].time?.seconds
                      ? new Date(
                          analyticsData.realTimeData[0].time.seconds * 1000
                        ).toLocaleString()
                      : new Date(
                          analyticsData.realTimeData[0].time
                        ).toLocaleString()
                    : "N/A"
                }
              />
            </div>
            <div className="w-full">
              <DashboardChart
                data={analyticsData.realTimeData}
                personnelInfo={analyticsData.personnelInfo}
              />
            </div>
          </div>

          {/* Second row: Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {/* First OverviewCard */}
            <OverviewCard
              title="Top Barangay"
              description={`Highest count in ${topBarangay.monthLabel || "–"}`}>
              <div className="flex flex-col items-center justify-center space-y-2 py-4">
                {/* Barangay Name */}
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-black">
                  {topBarangay.name || "N/A"}
                </p>

                {/* Count */}
                <div className="flex items-baseline space-x-1">
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-red">
                    {topBarangay.count ?? 0}
                  </span>
                  <span className="text-xl sm:text-1xl md:text-2xl lg:text-3xl font-medium text-black">
                    {topBarangay.count === 1 ? "record" : "records"}
                  </span>
                </div>
              </div>
            </OverviewCard>

            {/* Second OverviewCard */}
            <OverviewCard
              title="Sensor Alert Severity"
              description="Based on critical sensor readings."
            >
              <div className="w-full text-center space-y-2">
                {/* Severity Percentage */}
                <p className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-black">
                  {severity}%
                </p>

                {/* Severity Label */}
                <p className="text-base sm:text-md md:text-lg lg:text-2xl font-semibold text-black">
                  Severity Ratio
                </p>

                {/* Affected Sensors */}
                <p className="text-xs sm:text-xs md:text-md lg:text-lg font-medium text-black">
                  Affected Sensors:{" "}
                  <span className="text-red font-bold">
                    {activeSensorNames.length > 0 ? activeSensorNames.join(", ") : "None"}
                  </span>
                </p>
              </div>
            </OverviewCard>

            {/* Third OverviewCard */}
            {/* On small/medium screens, this card will span 2 columns */}
            <div className="col-span-2 lg:col-span-1">
              <OverviewCard
                title="Responder Notification History"
                description="Previous Notifications for this Personnel">
                <div className="max-h-40 overflow-y-auto text-center p-2">
                  {sortedNotifications && sortedNotifications.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {sortedNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-1 mb-2 rounded-lg w-full ${
                            notification.isCritical
                              ? "bg-red border border-red text-white"
                              : "bg-green border border-green text-white"
                          }`}>
                          <p className="text-[10px] sm:text-[10px] md:text-[12px] lg:text-[12px] xl:text-[14px] 2xl:text-[14px] font-semibold">
                            {notification.message}
                          </p>
                          <p className="text-[10px] sm:text-[12px] md:text-[12px] lg:text-[12px] xl:text-[14px] 2xl:text-[14px] font-bold">
                            Value: {notification.value}
                          </p>
                          <p className="text-[8px] sm:text-[8px] md:text-[10px] lg:text-[10px] xl:text-[12px] 2xl:text-[12px]">
                            {notification.timestamp
                              ? notification.timestamp.seconds
                                ? new Date(
                                    notification.timestamp.seconds * 1000
                                  ).toLocaleString()
                                : new Date(
                                    notification.timestamp
                                  ).toLocaleString()
                              : "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[26px] font-semibold text-black">
                      No notifications available.
                    </p>
                  )}
                </div>
              </OverviewCard>
            </div>
          </div>
        </div>
      </BodyCard>
      <AddPersonnelModal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
}

export default DashboardBody;
