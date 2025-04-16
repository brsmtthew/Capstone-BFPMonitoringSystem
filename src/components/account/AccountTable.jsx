import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import { toast } from "react-toastify";

function AccountTable({ selectedPersonnel }) {
  const [adminAudits, setAdminAudits] = useState([]);
  const [personnelAudits, setPersonnelAudits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedPersonnel) return;

    const fetchAudits = async () => {
      setLoading(true);
      try {
        if (selectedPersonnel.role === "admin") {
          // For admin, fetch both adminAudit and personnelAudit concurrently
          const adminAuditRef = collection(db, "adminAudit");
          const personnelAuditRef = collection(db, "personnelAudit");

          const adminQuery = query(
            adminAuditRef,
            where("user", "==", selectedPersonnel.email)
          );
          const personnelQuery = query(
            personnelAuditRef,
            where("user", "==", selectedPersonnel.email)
          );

          const [adminSnapshot, personnelSnapshot] = await Promise.all([
            getDocs(adminQuery),
            getDocs(personnelQuery)
          ]);

          const adminAuditData = adminSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

          const personnelAuditData = personnelSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

          setAdminAudits(adminAuditData);
          setPersonnelAudits(personnelAuditData);
        } else {
          // For non-admins, only fetch personnelAudit logs
          const personnelAuditRef = collection(db, "personnelAudit");
          const q = query(
            personnelAuditRef,
            where("user", "==", selectedPersonnel.email)
          );
          const snapshot = await getDocs(q);
          const auditData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setPersonnelAudits(auditData);
        }
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
      <h3 className="text-xl font-bold mb-4">
        Personnel Audit Logs {selectedPersonnel?.email}
      </h3>
      {loading ? (
        <p>Loading audit logs...</p>
      ) : selectedPersonnel.role === "admin" ? (
        <>
          <h4 className="text-lg font-bold mb-2">Admin Audit Logs</h4>
          {adminAudits.length > 0 ? (
            <table className="w-full text-sm text-left bg-bfpNavy rounded-lg p-2 mb-4">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Action</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {adminAudits.map((audit) => (
                  <tr key={audit.id} className="border-b">
                    <td className="px-4 py-2">{audit.action}</td>
                    <td className="px-4 py-2">{audit.data?.email}</td>
                    <td className="px-4 py-2">{audit.data?.role}</td>
                    <td className="px-4 py-2">{audit.data?.contact || "N/A"}</td>
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
            <p>No admin audit logs available.</p>
          )}

          <h4 className="text-lg font-bold mb-2">Personnel Audit Logs</h4>
          {personnelAudits.length > 0 ? (
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
                {personnelAudits.map((audit) => (
                  <tr key={audit.id} className="border-b">
                    <td className="px-4 py-2">{audit.action}</td>
                    <td className="px-4 py-2">{audit.data?.name}</td>
                    <td className="px-4 py-2">{audit.data?.gearId}</td>
                    <td className="px-4 py-2">{audit.data?.age || "N/A"}</td>
                    <td className="px-4 py-2">{audit.data?.birthdate || "N/A"}</td>
                    <td className="px-4 py-2">{audit.data?.phone || "N/A"}</td>
                    <td className="px-4 py-2">{audit.data?.position || "N/A"}</td>
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
            <p>No personnel audit logs available.</p>
          )}
        </>
      ) : personnelAudits.length > 0 ? (
        // For non-admins, only display personnel audit logs
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
            {personnelAudits.map((audit) => (
              <tr key={audit.id} className="border-b">
                <td className="px-4 py-2">{audit.action}</td>
                <td className="px-4 py-2">{audit.data?.name}</td>
                <td className="px-4 py-2">{audit.data?.gearId}</td>
                <td className="px-4 py-2">{audit.data?.age || "N/A"}</td>
                <td className="px-4 py-2">{audit.data?.birthdate || "N/A"}</td>
                <td className="px-4 py-2">{audit.data?.phone || "N/A"}</td>
                <td className="px-4 py-2">{audit.data?.position || "N/A"}</td>
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

export default AccountTable;
