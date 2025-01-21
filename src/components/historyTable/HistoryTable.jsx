import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
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
          const notificationsRef = collection(db, `personnelRecords/${selectedPersonnel.documentId}/notifications`);
          const notifSnapshot = await getDocs(notificationsRef);
          const notifications = notifSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

          setNotifications(notifications);
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
  }, [selectedPersonnel]); // This useEffect only runs when `selectedPersonnel` changes.

  if (!selectedPersonnel) {
    return <p className="text-white text-center mt-4">Select a personnel to view details.</p>;
  }

  return (
    <div className="mt-4 bg-bfpOrange rounded-lg shadow-md p-6">
      <h3 className="text-white text-lg font-bold mb-4">
        Notifications for {selectedPersonnel.name}
      </h3>
      <div className="relative overflow-x-auto">
        {loading ? (
          <p className="text-white">Loading notifications...</p>
        ) : (
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
                  <tr key={notif.id} className="border-b bg-bfpNavy hover:bg-searchTable">
                    <td className="px-6 py-3">{notif.sensor || "N/A"}</td>
                    <td className="px-6 py-3">{notif.value || "N/A"}</td>
                    <td className="px-6 py-3">{notif.message || "N/A"}</td>
                    <td className="px-6 py-3">{new Date(notif.timestamp).toLocaleString()}</td>
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
        )}
      </div>
    </div>
  );
}

export default HistoryTable;
