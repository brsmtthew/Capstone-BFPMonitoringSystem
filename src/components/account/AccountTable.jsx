import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import { toast } from "react-toastify";

function PersonnelAuditTable({selectedPersonnel}) {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch if a user is selected
    if (!selectedPersonnel) return;

    const fetchAudits = async () => {
      setLoading(true);
      try {
        // Reference the personnelAudit collection
        const auditRef = collection(db, "personnelAudit");

        // Filter audit logs to those that match the selected user's email (or use user id if preferred)
        const q = query(
          auditRef,
          where("user", "==", selectedPersonnel.email),
        );
        const snapshot = await getDocs(q);
        const auditData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAudits(auditData);
      } catch (error) {
        toast.error("Error fetching audit data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAudits();
  }, [selectedPersonnel]);

  return (
    <div className="mt-4 bg-bfpOrange rounded-xl shadow-md p-4">
      <h3 className="text-xl font-bold mb-4">Personnel Audit Logs {selectedPersonnel?.email}</h3>
      {loading ? (
        <p>Loading audit logs...</p>
      ) : audits.length > 0 ? (
        <table className="w-full text-sm text-left bg-bfpNavy rounded-lg p-2">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">GearId</th>
              <th className="px-4 py-2">Age</th>
              <th className="px-4 py-2">BirthDate</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {audits.map((audit) => (
              <tr key={audit.id} className="border-b">
                <td className="px-4 py-2">{audit.action}</td>
                <td className="px-4 py-2">{audit.data?.name}</td>
                <td className="px-4 py-2">{audit.data?.gearId}</td>
                <td className="px-4 py-2">
                  {audit.data?.age || "N/A"}
                </td>
                <td className="px-4 py-2">
                  {audit.data?.birthdate || "N/A"}
                </td>
                <td className="px-4 py-2"> {audit.data?.phone || "N/A"}</td>
                <td className="px-4 py-2">
                  {audit.data?.position || "N/A"}
                </td>
                <td className="px-4 py-2">
                  {audit.timestamp
                    ? new Date(audit.timestamp.seconds * 1000).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No audit logs available.</p>
      )}
    </div>
  );
}

export default PersonnelAuditTable;
