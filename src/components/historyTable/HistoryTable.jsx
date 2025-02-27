import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import { toast } from "react-toastify";

function HistoryTable({ selectedPersonnel }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        if (selectedPersonnel && selectedPersonnel.documentId) {
          const notificationsRef = collection(
            db,
            `personnelRecords/${selectedPersonnel.documentId}/notifications`
          );
          // Query ordering by timestamp descending.
          const q = query(notificationsRef, orderBy("timestamp", "desc"));
          const notifSnapshot = await getDocs(q);
          const notificationsData = notifSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotifications(notificationsData);
        } else {
          toast.error("Invalid selected personnel or documentId.");
        }
      } catch (error) {
        toast.error(`Error fetching notifications: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (selectedPersonnel) {
      fetchNotifications();
    }
  }, [selectedPersonnel]);

  if (!selectedPersonnel) {
    return (
      <p className="text-white text-center mt-4">
        Select a personnel to view details.
      </p>
    );
  }

  return (
    <div className="mt-4 bg-bfpOrange rounded-lg shadow-md p-2 sm:p-3 md:p-4 lg:p-5 xl:p-5 2xl:p-6">
      <h3 className="text-white text-[12px] sm:text-[14px] md:text-[16px] lg:[18px] xl:text-[20px] 2xl:text-[22px] font-bold mb-4">
        Notifications for {selectedPersonnel.name}
      </h3>
      <div className="relative overflow-x-auto">
        {loading ? (
          <p className="text-white">Loading notifications...</p>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full text-sm text-left text-white bg-bfpNavy">
                <thead className="text-xs uppercase bg-searchTable text-white">
                  <tr>
                    <th className="px-6 py-3">Sensor</th>
                    <th className="px-6 py-3">Value</th>
                    <th className="px-6 py-3">Notification</th>
                    <th className="px-6 py-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <tr
                        key={notif.id}
                        className="border-b bg-bfpNavy hover:bg-searchTable"
                      >
                        <td className="px-6 py-3">{notif.sensor || "N/A"}</td>
                        <td className="px-6 py-3">
                          {notif.value === undefined ? "N/A" : notif.value}
                        </td>
                        <td className="px-6 py-3">{notif.message || "N/A"}</td>
                        <td className="px-6 py-3">
                          {new Date(notif.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-6 py-3 text-center" colSpan={4}>
                        No notifications available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden text-[8px]">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="bg-bfpNavy rounded-lg shadow-md p-4 mb-4"
                  >
                    <div className="mb-2">
                      <span className="font-semibold text-white">Sensor:</span>{" "}
                      <span className="text-white">
                        {notif.sensor || "N/A"}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-white">Value:</span>{" "}
                      <span className="text-white">
                        {notif.value === undefined ? "N/A" : notif.value}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-white">
                        Notification:
                      </span>{" "}
                      <span className="text-white">
                        {notif.message || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-white">
                        Timestamp:
                      </span>{" "}
                      <span className="text-white">
                        {new Date(notif.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white text-center">No notifications available.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default HistoryTable;
