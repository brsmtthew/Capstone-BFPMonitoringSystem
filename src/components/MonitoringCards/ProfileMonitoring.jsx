import React from 'react';

import bfpPro from "../pageBody/dashboardAssets/bfpPersonnel.jpg";

function ProfileMonitoring({ personnel }) {
  return (
    <div className="p-4 rounded-lg shadow bg-gradient-to-tl from-start-gradient to-end-gradient flex flex-col">
      {personnel ? (
        <>
          <img
            src={personnel.image || bfpPro}
            alt="Profile"
            className="w-full h-96 object-cover rounded-3xl"
          />
          <div className="p-4 flex flex-col items-center">
            <p className="text-[24px] font-bold text-center">{personnel.name}</p>
            <p className="text-center text-gray">{personnel.position}</p>
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
  );
}

export default ProfileMonitoring;
