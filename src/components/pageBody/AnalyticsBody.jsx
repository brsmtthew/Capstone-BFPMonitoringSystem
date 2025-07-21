import React, { useEffect, useRef, useState, useMemo } from "react";
import HeaderSection from "../header/HeaderSection";
import BodyCard from "../parentCard/BodyCard";
import HealthChartSection from "../chart/HealthChartSection";
import EnvironmentChartSection from "../chart/EnvironmentChartSection";
import { useLocation } from "react-router-dom";
import { db } from "../../firebase/Firebase";
import Summary from "../chart/Summary";
import { toast } from "react-toastify";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

const AnalyticsBody = () => {
  const location = useLocation();
  const [rawSubset, setRawSubset] = useState([]); // holds sliced data before outlier-filtering
  const [personnelInfo, setPersonnelInfo] = useState({
    name: "",
    date: "",
    time: "",
    gearId: "",
  });
  const [allData, setAllData] = useState([]);
  const [availableGearIds, setAvailableGearIds] = useState([]);
  const [selectedGearId, setSelectedGearId] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [gearDateRange, setGearDateRange] = useState({ start: "", end: "" });
  const hasShownToast = useRef(false);
  const hasFetchedInitialData = useRef(false);
  const [isRawShown, setIsRawShown] = useState(false);
  const [outliers, setOutliers] = useState({
  smoke: [],
  envi: [],
  toxic: [],
  temp: [],
});

  const fetchInitialData = async () => {
    try {
      const personnelRecordsQuery = query(
        collection(db, "personnelRecords"),
        orderBy("date", "desc"),
        limit(1)
      );
      const personnelSnapshot = await getDocs(personnelRecordsQuery);

      if (!personnelSnapshot.empty) {
        const latestDoc = personnelSnapshot.docs[0];
        const personnelData = latestDoc.data();

        const realTimeDataSnap = await getDocs(
          collection(db, "personnelRecords", latestDoc.id, "realTimeData")
        );
        const realTimeData = realTimeDataSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter each metric
        const filteredSmoke = prepareFiltered(
          "smokeSensor",
          realTimeData,
          "MAD"
        );
        const filteredEnvi = prepareFiltered(
          "environmentalTemperature",
          realTimeData,
          "z"
        );
        const filteredToxic = prepareFiltered(
          "ToxicGasSensor",
          realTimeData,
          "z"
        );
        const filteredTemp = prepareFiltered(
          "bodyTemperature",
          realTimeData,
          "z"
        );

        // Merge all filtered data (based on date + time + value match)
        const combinedKept = new Set(
          [
            ...filteredSmoke,
            ...filteredEnvi,
            ...filteredToxic,
            ...filteredTemp,
          ].map((d) => `${d.date} ${d.time}`)
        );

        const finalFiltered = realTimeData.filter((d) => {
          const timestamp = `${d.date} ${d.time}`;
          return combinedKept.has(timestamp);
        });

        setRawSubset(finalFiltered);
        setPersonnelInfo({
          name: personnelData.personnelName || "",
          date: personnelData.date || "",
          time: personnelData.time || "",
          gearId: personnelData.gearId || "",
        });

        // toast.success("Fetched latest personnel real-time data.");
      } else {
        toast.info("No personnel records found.");
      }
    } catch (error) {
      console.error("Error in fetchInitialData:", error);
      toast.error("Failed to fetch latest real-time data.");
    }
  };

  // Fetch all personnel + realtime entries
  const fetchAllWithRealtime = async () => {
    try {
      const snap = await getDocs(collection(db, "personnelRecords"));
      if (snap.empty) return;
      const records = await Promise.all(
        snap.docs.map(async (doc) => {
          const info = { id: doc.id, ...doc.data() };
          const rtSnap = await getDocs(
            collection(db, "personnelRecords", doc.id, "realTimeData")
          );
          const realtime = rtSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
          return { personnelInfo: info, realTimeData: realtime };
        })
      );
      setAllData(records);

      // populate Gear IDs
      const gearSet = new Set(
        records.map((r) => r.personnelInfo.gearId).filter(Boolean)
      );
      setAvailableGearIds(
        Array.from(gearSet).sort((a, b) => {
          const na = parseInt(a.match(/\d+/)?.[0]);
          const nb = parseInt(b.match(/\d+/)?.[0]);
          return na - nb;
        })
      );

      // populate all months present
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const mset = new Set();
      records.forEach(({ realTimeData }) =>
        realTimeData.forEach((e) => {
          if (e.date) {
            const idx = parseInt(e.date.split("/")[0], 10) - 1;
            if (idx >= 0 && idx < 12) mset.add(monthNames[idx]);
          }
        })
      );
      setAvailableMonths(Array.from(mset));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load analytics data.");
    }
  };

  // slice by gear & month, then store into rawSubset (no outlier removal here)
  const filterData = (gearId, monthName) => {
    let filtered = allData;
    if (gearId) {
      filtered = filtered.filter((r) => r.personnelInfo.gearId === gearId);
    }

    // update personnelInfo
    if (filtered.length) {
      const p = filtered[0].personnelInfo;
      setPersonnelInfo({
        name: p.personnelName || "",
        date: p.date || "",
        time: p.time || "",
        gearId: p.gearId || "",
      });
    } else {
      setPersonnelInfo({ name: "", date: "", time: "", gearId: "" });
    }

    // flatten entries
    let entries = filtered.flatMap((r) => r.realTimeData);

    // month slice
    if (monthName) {
      const idx =
        [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ].indexOf(monthName) + 1;
      entries = entries.filter(
        (e) => parseInt(e.date.split("/")[0], 10) === idx
      );
    }

    setRawSubset(entries);
    toast.info(
      `Showing data for ${gearId || "all gears"}${
        monthName ? ` in ${monthName}` : ""
      }`
    );
  };

  const handleGearChange = (e) => {
    const gear = e.target.value;
    setSelectedGearId(gear);

    if (gear === "") {
      // User re-selected "Select Gear IDs"
      setSelectedMonth("");
      setRawSubset([]);
      setAvailableMonths([]);
      setPersonnelInfo({ name: "", date: "", time: "", gearId: "" });
      setGearDateRange({ start: "", end: "" });

      // Re-fetch the initial default data
      fetchInitialData();
      return;
    }
    // rebuild month list & date range for this gear
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const mset = new Set();
    const dates = [];

    let foundInfo = null;

    allData.forEach(({ personnelInfo, realTimeData }) => {
      if (personnelInfo.gearId === gear) {
        if (!foundInfo) foundInfo = personnelInfo;

        realTimeData.forEach((ent) => {
          if (ent.date) {
            const [mm, dd, yy] = ent.date.split("/");
            const m = parseInt(mm, 10) - 1;
            if (m >= 0 && m < 12) {
              mset.add(monthNames[m]);
              dates.push(new Date(`${yy}-${mm + 1}-${dd}`)); // Note: mm+1 to fix month offset
            }
          }
        });
      }
    });

    // ✅ Set personnel info right away
    if (foundInfo) {
      setPersonnelInfo({
        name: foundInfo.personnelName || "",
        date: foundInfo.date || "",
        time: foundInfo.time || "",
        gearId: foundInfo.gearId || "",
      });
    } else {
      setPersonnelInfo({ name: "", date: "", time: "", gearId: "" });
    }

    // ✅ Still update available months
    setAvailableMonths(Array.from(mset));

    // ✅ Set gear date range, for UI display (not filtering)
    dates.sort((a, b) => a - b);
    if (dates.length) {
      const start = monthNames[dates[0].getMonth()];
      const end = monthNames[dates[dates.length - 1].getMonth()];
      setGearDateRange({ start, end: start === end ? "" : end });
    } else {
      setGearDateRange({ start: "", end: "" });
    }

    // Reset month selection, but DO NOT filter anything yet
    setSelectedMonth("");
    setRawSubset([]); // optional: clear data
    toast.info("Please select a month to view data.");
  };


  const handleMonthChange = (e) => {
    const mon = e.target.value;
    setSelectedMonth(mon);

    if (!mon) {
      setRawSubset([]);
      toast.info("Please select a valid month to view data.");
      return;
    }

    filterData(selectedGearId, mon);
  };

  // Only fetch all data on mount
  useEffect(() => {
    fetchAllWithRealtime();
  }, []);

  // Conditionally fetch initial data
  // useEffect(() => {
  //   const hasLocationData = location.state?.realTimeData?.length > 0;
  //   const hasDropdownSelections = selectedGearId || selectedMonth;

  //   if (!hasLocationData && !hasDropdownSelections && rawSubset.length === 0) {
  //     fetchInitialData();
  //   }
  // }, [selectedGearId, selectedMonth, rawSubset, location.state]);

  useEffect(() => {
    const hasLocationData = location.state?.realTimeData?.length > 0;
    const hasDropdownSelections = selectedGearId || selectedMonth;

    if (
      !hasLocationData &&
      !hasDropdownSelections &&
      rawSubset.length === 0 &&
      !hasFetchedInitialData.current
    ) {
      fetchInitialData();
      hasFetchedInitialData.current = true;
    }
  }, [selectedGearId, selectedMonth, rawSubset, location.state]);


  const prepareFiltered = (key, data, method) => {
    const series = data
      .filter((d) => d[key] !== undefined)
      .map((d) => ({ date: d.date, time: d.time, value: d[key] }));

    const sorted = series.sort(
      (a, b) =>
        new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)
    );

    let filtered;
    if (method === "MAD") {
      filtered = filterByMAD(sorted);
    } else {
      filtered = filterByZ(sorted);
    }

    return filtered;
  };

  // initial load via navigation state?
  useEffect(() => {
    if (hasShownToast.current) return;
    if (location.state?.realTimeData) {
      setRawSubset(location.state.realTimeData);
      setPersonnelInfo({
        name: location.state.name || "",
        date: location.state.date || "",
        time: location.state.time || "",
        gearId: location.state.gearId || "",
      });
      toast.success("Analytics data has been loaded.");
    }
    hasShownToast.current = true;
  }, [location.state]);

  // Outlier-filter helpers
  const calculateMean = (arr) =>
    arr.reduce((sum, v) => sum + v, 0) / arr.length;
  const calculateStd = (arr, m) =>
    Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
  const calculateMedian = (arr) => {
    const s = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid];
  };
  const calculateMAD = (arr, med) =>
    calculateMedian(arr.map((v) => Math.abs(v - med)));

  const filterByZ = (data, t = 3) => {
    if (!data.length) return [];
    const vals = data.map((d) => d.value);
    const m = calculateMean(vals);
    const sd = calculateStd(vals, m);
    return data.filter((d) => Math.abs((d.value - m) / sd) <= t);
  };

  const filterByMAD = (data, t = 3) => {
    if (!data.length) return [];
    const vals = data.map((d) => d.value);
    const med = calculateMedian(vals);
    const mad = calculateMAD(vals, med);
    return data.filter((d) => Math.abs((0.6745 * (d.value - med)) / mad) <= t);
  };

  // build series with outlier removal applied to rawSubset
  const prepareSeries = (key, method) => {
    const series = rawSubset
      .filter((d) => d[key] !== undefined)
      .map((d) => ({ date: d.date, time: d.time, value: d[key] }));

    const sorted = series.sort(
      (a, b) =>
        new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)
    );

    let filtered;
    if (method === "MAD") {
      filtered = filterByMAD(sorted);
    } else {
      filtered = filterByZ(sorted);
    }

    // Create a Set of allowed timestamps (date + time) to identify what remains
    const keptSet = new Set(
      filtered.map((d) => `${d.date} ${d.time} ${d.value}`)
    );

    // Filter out only the removed outliers
    const removed = sorted.filter(
      (d) => !keptSet.has(`${d.date} ${d.time} ${d.value}`)
    );

     setOutliers((prev) => ({
      ...prev,
      [key === "smokeSensor" ? "smoke" :
      key === "environmentalTemperature" ? "envi" :
      key === "ToxicGasSensor" ? "toxic" : "temp"]: removed,
    }));

    console.log(
      `\n=== ${key.toUpperCase()} - Removed Outliers using ${method} ===`
    );
    console.table(removed); // cleaner format

    return filtered;
  };

  const smokeDataSeries = useMemo(() => {
    if (isRawShown) {
      const sortedRaw = [...rawSubset].sort(
        (a, b) =>
          new Date(`${a.date} ${a.time}`) -
          new Date(`${b.date} ${b.time}`)
      );
      return sortedRaw
        .filter((d) => d.smokeSensor !== undefined)
        .map((d) => ({
          date: d.date,
          time: d.time,
          value: d.smokeSensor,
        }));
    } else {
      return prepareSeries("smokeSensor", "MAD");
    }
  }, [rawSubset, isRawShown]);

  const enviDataSeries = useMemo(() => {
    if (isRawShown) {
      const sortedRaw = [...rawSubset].sort(
        (a, b) =>
          new Date(`${a.date} ${a.time}`) -
          new Date(`${b.date} ${b.time}`)
      );
      return sortedRaw
        .filter((d) => d.environmentalTemperature !== undefined)
        .map((d) => ({
          date: d.date,
          time: d.time,
          value: d.environmentalTemperature,
        }));
    } else {
      return prepareSeries("environmentalTemperature", "z");
    }
  }, [rawSubset, isRawShown]);

  const toxicSeries = useMemo(() => {
    if (isRawShown) {
      const sortedRaw = [...rawSubset].sort(
        (a, b) =>
          new Date(`${a.date} ${a.time}`) -
          new Date(`${b.date} ${b.time}`)
      );
      return sortedRaw
        .filter((d) => d.ToxicGasSensor !== undefined)
        .map((d) => ({
          date: d.date,
          time: d.time,
          value: d.ToxicGasSensor,
        }));
    } else {
      return prepareSeries("ToxicGasSensor", "z");
    }
  }, [rawSubset, isRawShown]);

  const temperatureDataSeries = useMemo(() => {
    if (isRawShown) {
      const sortedRaw = [...rawSubset].sort(
        (a, b) =>
          new Date(`${a.date} ${a.time}`) -
          new Date(`${b.date} ${b.time}`)
      );
      return sortedRaw
        .filter((d) => d.bodyTemperature !== undefined)
        .map((d) => ({
          date: d.date,
          time: d.time,
          value: d.bodyTemperature,
        }));
    } else {
      return prepareSeries("bodyTemperature", "z");
    }
  }, [rawSubset, isRawShown]);

  return (
    <div className="p-4 min-h-screen flex flex-col lg:bg-white font-montserrat">
      <HeaderSection
        title="ANALYTICS OVERVIEW"
        extraContent={
          <div className="flex space-x-5">
            <div className="hidden lg:flex space-x-5">
              <select
                value={selectedGearId}
                onChange={handleGearChange}
                className="w-full sm:w-32 md:w-36 lg:w-40 px-3 py-1 border rounded-md bg-white text-black shadow-sm">
                <option value="">
                  Select Gear IDs
                </option>
                {availableGearIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                disabled={!selectedGearId}
                className="w-full sm:w-32 md:w-36 lg:w-40 px-3 py-1 border rounded-md bg-white text-black shadow-sm">
                <option value="">Select Month</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((m) => (
                  <option
                    key={m}
                    value={m}
                    disabled={!availableMonths.includes(m)}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div
              onClick={() => setIsRawShown((prev) => !prev)}
              className={`
                flex items-center cursor-pointer rounded-full px-1 transition-all duration-300
                ${isRawShown ? "bg-bfpOrange" : "bg-bfpNavy"}
                w-12 h-7 sm:w-12 sm:h-7 md:w-12 md:h-7 lg:w-24 lg:h-9
              `}
            >
              <div
                className={`
                  bg-white rounded-full shadow-md transition-transform duration-300
                  w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-5 lg:h-5
                  ${isRawShown ? "translate-x-[1.7rem] lg:translate-x-[4.0rem]" : "translate-x-1"}
                `}
              />
              {/* Text shown only on lg and above */}
              <span className="hidden lg:inline ml-2 mr-2 text-white font-semibold text-sm">
                {isRawShown ? "Raw" : "Filter"}
              </span>
            </div>
          </div>
        }
      />
      <div className="my-2 h-[2px] bg-separatorLine w-[80%] mx-auto" />

      <BodyCard>
        <div className="mb-6">
          <Summary
            name={personnelInfo.name}
            gearId={personnelInfo.gearId}
            date={personnelInfo.date}
            time={personnelInfo.time}
            temperatureData={temperatureDataSeries}
            smokeData={smokeDataSeries}
            enviData={enviDataSeries}
            ToxicGas={toxicSeries}
            startMonth={gearDateRange.start}
            endMonth={gearDateRange.end}
            selectedMonth={selectedMonth}
            outliers={outliers}
          />
        </div>
        <EnvironmentChartSection
          smokeData={smokeDataSeries}
          enviData={enviDataSeries}
          ToxicGas={toxicSeries}
          temperatureData={temperatureDataSeries}
        />
      </BodyCard>
    </div>
  );
};

export default AnalyticsBody;
