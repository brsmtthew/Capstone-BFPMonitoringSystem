import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/Firebase';
import heartIcon from "./dashboardAssets/heart-attack.png";
import enviTemp from "./dashboardAssets/room-temperature.png";
import toxicSmoke from "./dashboardAssets/mask.png";
import bodytem from "./dashboardAssets/measure.png";
import bfpPro from "./dashboardAssets/bfpPersonnel.jpg";
import toxicIcon from "./dashboardAssets/toxic.png";
import quesmarkIcon from "./dashboardAssets/question-mark.png"; // Ensure this file exists
import warningIcon from "./dashboardAssets/warning.png";
import flamesIcon from "./dashboardAssets/flames.png";
import likeIcon from "./dashboardAssets/like.png";

function MonitoringBody() {
  const [personnel, setPersonnel] = useState([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'personnelInfo'), (querySnapshot) => {
      const personnelData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPersonnel(personnelData);
    });

    return () => unsubscribe();
  }, []);

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const selected = personnel.find((p) => p.id === selectedId);
    setSelectedPersonnel(selected);
  };

  return (
    <div className="p-4 min-h-screen flex flex-col lg:bg-white">
      {/* Header Section */}
      <div className="flex justify-between items-center gap-x-40 text-black px-4 sm:px-10 md:px-20 lg:px-40">
        <div className="flex items-center">
          <div className="h-10 w-2 rounded-full bg-separator mr-2" />
          <p className="text-[26px] font-bold">REAL-TIME MONITORING</p>
        </div>
        <div className="ml-4 flex items-center">
          <select
            className="text-xl text-white bg-primeColor font-semibold border border-gray-300 rounded-lg px-4 py-2"
            onChange={handleSelectChange}
          >
            <option value="">Select Personnel</option>
            {personnel.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="my-4 h-[2px] bg-separatorLine w-[80%] mx-auto" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 text-white min-h-full pb-2">
        {/* Left Column: Personnel Details */}
        <div className="lg:col-span-1 flex flex-col justify-center">
          <div className="p-4 rounded-lg shadow bg-gradient-to-tl from-start-gradient to-end-gradient flex flex-col">
            {selectedPersonnel ? (
              <>
                <img
                  src={selectedPersonnel.image || bfpPro}
                  alt="Profile"
                  className="w-full h-96 object-cover rounded-3xl"
                />
                <div className="p-4 flex flex-col items-center">
                  <p className="text-[24px] font-bold text-center">{selectedPersonnel.name}</p>
                  <p className="text-center text-gray">{selectedPersonnel.position}</p>
                  <div className="text-center mt-4">
                    <button className="px-8 py-3 text-[18px] bg-blue rounded-2xl text-white active:bg-blue-dark">
                      Save Recordings
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-lg text-gray-300">Select a personnel to view details</p>
            )}
          </div>
        </div>

        {/* Right Column: Monitoring Sections */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="p-4 rounded-lg shadow bg-primeColor">
            <p className="font-bold text-[26px] text-center">Health Monitoring Section</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <MonitoringCard
                icon={heartIcon}
                title="Body Temperature"
                value="120 BPM"
                description="Elevated Heart Rate"
                warningIcon={warningIcon}
              />
              <MonitoringCard
                icon={bodytem}
                title="Heart Rate"
                value="50°C"
                description="Critical Temperature"
                warningIcon={flamesIcon}
              />
            </div>
          </div>

          <div className="p-4 rounded-lg shadow bg-primeColor">
            <p className="font-bold text-[26px] text-center">Environmental Monitoring Section</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <MonitoringCard
                icon={toxicSmoke}
                title="Toxic Gas"
                value="5 PPM"
                description="Optimal Range"
                warningIcon={likeIcon}
              />
              <MonitoringCard
                icon={toxicSmoke}
                title="Smoke"
                value="100 PPM"
                description="Safe Level"
                warningIcon={likeIcon}
              />
              <MonitoringCard
                icon={enviTemp}
                title="Environmental Temp"
                value="25°C"
                description="Normal Temperature"
                warningIcon={likeIcon}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const MonitoringCard = ({ icon, title, value, description, warningIcon }) => (
  <div className="rounded-2xl shadow bg-gradient-to-tl from-start-gradient to-end-gradient flex flex-col items-center justify-start">
    <div className="p-4 rounded-lg text-white flex flex-col items-center w-full">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <img src={icon} alt={title} className="w-10 h-10" />
          <span className="font-semibold text-[18px]">{title}</span>
        </div>
        <div className="flex space-x-2 items-center">
          <button className="bg-btnActive text-btnFontActive px-4 py-1 rounded-2xl text-[18px]">Active</button>
          <img src={quesmarkIcon} alt="Question Mark" className="w-8 h-8" />
        </div>
      </div>

      <div className="my-4 h-[1px] bg-separatorLine w-full" />

      <div className="text-center">
        <p className="text-[42px] font-bold">{value}</p>
        <div className="flex items-center justify-center text-[24px] text-yellow">
          <p className="mr-2">{description}</p>
          <img src={warningIcon} alt="Status Icon" className="w-10 h-10" />
        </div>
      </div>
    </div>
  </div>
);

export default MonitoringBody;
