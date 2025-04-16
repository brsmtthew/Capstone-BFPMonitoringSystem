import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import sortIcon from "./dashboardAssets/sort.png";
import searchIcon from "./dashboardAssets/glass.png";
import HeaderSection from "../header/HeaderSection";
import BodyCard from "../parentCard/BodyCard";
import HistoryTable from "../historyTable/HistoryTable";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import DeletePersonnelModal from "../modal/deletePersonnelModal";

function HistoryBody() {
  const [historyData, setHistoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [expandedPersonnel, setExpandedPersonnel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const isAdmin = userData && userData.role === "admin";
  const isViewAllowed =
    userData && (userData.role === "admin" || userData.role === "user");

  useEffect(() => {
    const personnelRef = collection(db, "personnelRecords");

    // onSnapshot fetches data once initially and then only when there's a change.
    const unsubscribe = onSnapshot(
      personnelRef,
      (snapshot) => {
        // Process each document and fetch its notifications subcollection once
        const personnelPromises = snapshot.docs.map(async (docSnapshot) => {
          const personnel = docSnapshot.data();
          const documentId = docSnapshot.id;

          const notificationsRef = collection(docSnapshot.ref, "notifications");
          // Using getDocs here means notifications are fetched only once when the personnel doc is fetched.
          const notifSnapshot = await getDocs(notificationsRef);
          const notifications = notifSnapshot.docs.map((notifDoc) => {
            const notifData = notifDoc.data();
            const date = new Date(notifData.timestamp);
            return {
              gearId: notifData.gearId || "Unknown",
              event: notifData.event || "Critical",
              date: date.toLocaleDateString(),
              time: date.toLocaleTimeString(),
              sensor: notifData.sensor || "Unknown",
              value: notifData.value || "N/A",
              status: notifData.status || "Unknown",
            };
          });

          return {
            documentId,
            gearId: personnel.gearId || "No gearId",
            name: personnel.personnelName,
            date: personnel.date || "No date",
            time: personnel.time || "No time",
            totalNotifications: notifications.length,
            notifications,
          };
        });

        // Once all promises resolve, update the state.
        Promise.all(personnelPromises)
          .then((data) => {
            setHistoryData(data);
            setFilteredData(data);
          })
          .catch((error) => {
            console.error("Error processing snapshot:", error);
          })
          .finally(() => setLoading(false));
      },
      (error) => {
        console.error("Error fetching personnelRecords:", error);
        setLoading(false);
      }
    );

    // Cleanup the subscription on unmount.
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = historyData.filter((data) => {
      const name = data.name || "";
      const gearId = data.gearId || "";
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gearId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, historyData]);

  const handleRowClick = (personnel) => {
    setExpandedPersonnel(expandedPersonnel === personnel ? null : personnel);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectRow = (documentId) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(documentId)
        ? prevSelectedRows.filter((id) => id !== documentId)
        : [...prevSelectedRows, documentId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allDocumentIds = filteredData.map((data) => data.documentId);
      setSelectedRows(allDocumentIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSort = (option) => {
    let sortedData = [...filteredData];
    switch (option) {
      case "latest":
        sortedData.sort(
          (a, b) =>
            new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time)
        );
        break;
      case "name":
        sortedData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "gearId":
        sortedData.sort((a, b) => a.gearId.localeCompare(b.gearId));
        break;
      default:
        break;
    }
    setFilteredData(sortedData);
    setSortOption(option);
    setIsDropdownOpen(false);
  };

  const deleteSubcollection = async (parentDocRef, subcollectionName) => {
    const subcollectionRef = collection(parentDocRef, subcollectionName);
    const subSnapshot = await getDocs(subcollectionRef);
    const deletePromises = subSnapshot.docs.map((subDoc) =>
      deleteDoc(subDoc.ref)
    );
    return Promise.all(deletePromises);
  };

  const openDeleteModal = () => {
    if (selectedRows.length === 0) {
      toast.info("Please select at least one personnel to delete.");
      return;
    }
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    try {
      for (const documentId of selectedRows) {
        const docRef = doc(db, "personnelRecords", documentId);
        await deleteSubcollection(docRef, "notifications");
        await deleteSubcollection(docRef, "realTimeData");
        await deleteDoc(docRef);
      }
      setFilteredData(
        filteredData.filter((data) => !selectedRows.includes(data.documentId))
      );
      setSelectedRows([]);
      setIsDropdownOpen(false);
      toast.success("Selected Personnel deleted successfully");
    } catch (error) {
      console.error("Error deleting personnel: ", error);
      toast.error("Error deleting personnel");
    }
    closeDeleteModal();
  };

  const handleViewClick = async (documentId, name, date, time) => {
    try {
      const realTimeDataRef = collection(
        db,
        "personnelRecords",
        documentId,
        "realTimeData"
      );
      const realTimeDataSnapshot = await getDocs(realTimeDataRef);
      const realTimeData = [];

      realTimeDataSnapshot.forEach((doc) => {
        realTimeData.push({ id: doc.id, ...doc.data() });
      });

      navigate("/analytics", { state: { realTimeData, name, date, time } });
    } catch (error) {
      toast.error("Error fetching real-time data:");
    }
  };

  return (
    <div className="p-4 min-h-screen flex flex-col font-montserrat">
      <HeaderSection title="HISTORY" />
      <div className="my-4 h-[2px] bg-separatorLine w-[80%] mx-auto" />
      <BodyCard>
        <div className="bg-bfpNavy rounded-lg shadow-md p-6">
          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 pb-4">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex items-center text-white font-medium rounded-lg text-sm px-3 py-1.5 focus:outline-none border bg-bfpNavy"
              >
                Action
                <svg
                  className="w-2.5 h-2.5 ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                  aria-hidden="true"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute mt-2 bg-bfpNavy rounded-lg shadow-lg w-48 z-10">
                  <button
                    onClick={() => handleSort("latest")}
                    className="w-full text-left text-white px-4 py-2 hover:bg-searchTable"
                  >
                    Filter by Date
                  </button>
                  <button
                    onClick={() => handleSort("name")}
                    className="w-full text-left text-white px-4 py-2 hover:bg-searchTable"
                  >
                    Filter by Name
                  </button>
                  <button
                    onClick={() => handleSort("gearId")}
                    className="w-full text-left text-white px-4 py-2 hover:bg-searchTable"
                  >
                    Filter by Gear ID
                  </button>
                  <button
                    disabled={!isAdmin}
                    onClick={openDeleteModal}
                    className={`w-full text-left px-4 py-2 ${
                      !isAdmin
                        ? "bg-gray text-white cursor-not-allowed"
                        : "text-white hover:bg-searchTable"
                    }`}
                  >
                    Delete Selected Data
                  </button>
                </div>
              )}
            </div>
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search for users"
                className="block p-2 pl-10 text-sm text-white bg-bfpNavy border border-white rounded-lg w-full md:w-80"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <img src={searchIcon} alt="Search" className="w-4 h-4" />
              </div>
            </div>
          </div>
          {loading ? (
            <div className="text-white text-center py-6">Loading...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-white text-center py-6">No personnel data found</div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left text-white bg-bfpNavy">
                  <thead className="text-xs uppercase bg-searchTable text-white">
                    <tr>
                      <th className="p-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded text-green"
                          onChange={handleSelectAll}
                          checked={
                            filteredData.length > 0 &&
                            selectedRows.length === filteredData.length
                          }
                        />
                      </th>
                      <th className="px-6 py-3">Gear ID</th>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Time</th>
                      <th className="px-6 py-3">Total Notifications</th>
                      <th className="px-6 py-3">Analytics</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((data, index) => (
                      <React.Fragment key={index}>
                        <tr
                          onDoubleClick={() => handleRowClick(data)}
                          className="border-b bg-bfpNavy hover:bg-searchTable cursor-pointer"
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded text-green"
                              checked={selectedRows.includes(data.documentId)}
                              onChange={() => handleSelectRow(data.documentId)}
                            />
                          </td>
                          <td className="px-6 py-3">{data.gearId}</td>
                          <td className="px-6 py-3">{data.name}</td>
                          <td className="px-6 py-3">{data.date}</td>
                          <td className="px-6 py-3">{data.time}</td>
                          <td className="px-6 py-3">{data.totalNotifications}</td>
                          <td className="px-6 py-3 flex justify-start">
                            <button
                              disabled={!isViewAllowed}
                              onClick={() =>
                                handleViewClick(
                                  data.documentId,
                                  data.name,
                                  data.date,
                                  data.time
                                )
                              }
                              className={`px-4 py-2 rounded-lg transform transition duration-300 ${
                                !isViewAllowed
                                  ? "bg-gray opacity-70 cursor-not-allowed"
                                  : "bg-bfpOrange hover:scale-105"
                              }`}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                        {expandedPersonnel === data && (
                          <tr className="bg-bfpNavy">
                            <td colSpan="7">
                              <HistoryTable selectedPersonnel={data} />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile Card View */}
              <div className="block md:hidden">
                {filteredData.map((data, index) => (
                  <div
                    key={index}
                    className="bg-searchTable rounded-lg shadow-md p-4 mb-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-white">{data.name}</h3>
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded text-green"
                        checked={selectedRows.includes(data.documentId)}
                        onChange={() => handleSelectRow(data.documentId)}
                      />
                    </div>
                    <div className="mt-2 text-white text-sm">
                      <div>
                        <span className="font-semibold">Gear ID:</span> {data.gearId}
                      </div>
                      <div>
                        <span className="font-semibold">Date:</span> {data.date}
                      </div>
                      <div>
                        <span className="font-semibold">Time:</span> {data.time}
                      </div>
                      <div>
                        <span className="font-semibold">Notifications:</span>{" "}
                        {data.totalNotifications}
                      </div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <button
                        disabled={!isViewAllowed}
                        onClick={() =>
                          handleViewClick(
                            data.documentId,
                            data.name,
                            data.date,
                            data.time
                          )
                        }
                        className={`bg-bfpOrange px-3 py-2 rounded-lg text-white ${
                          !isViewAllowed && "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleRowClick(data)}
                        className="bg-blue px-3 py-2 rounded-lg text-white"
                      >
                        {expandedPersonnel === data ? "Hide Details" : "Show Details"}
                      </button>
                    </div>
                    {expandedPersonnel === data && (
                      <div className="mt-2">
                        <HistoryTable selectedPersonnel={data} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </BodyCard>
      <DeletePersonnelModal
        isOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default HistoryBody;
