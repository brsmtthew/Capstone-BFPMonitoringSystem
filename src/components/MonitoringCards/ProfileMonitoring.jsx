import React from 'react';
import bfpPro from "../pageBody/dashboardAssets/bfpPersonnel.jpg";

function ProfileMonitoring({ personnel }) {
  return (
    <div className="h-96 w-80 bg-white rounded-lg shadow-lg flex flex-col ">
      {/* Navbar section */}
      <div className="p-2 bg-bfpNavy rounded-lg text-white flex flex-col items-start">
        {personnel ? (
          <>
            <h3 className="text-lg font-bold">{personnel.name}</h3>
            <p className="text-sm text-gray-300">{personnel.position}</p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold">Select Personnel</h3>
            <p className="text-sm text-gray-300">Personnel Position</p>
          </>
        )}
      </div>

      {/* Content section */}
      <div className="flex-grow p-4 flex flex-col items-center justify-center">
        {/* Profile image */}
        <div className="h-52 w-52 rounded-full overflow-hidden mb-2">
          <img
            src={personnel?.image || 'https://via.placeholder.com/300x300'}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Action button */}
        <div className="text-center mt-4">
          <button className="px-6 py-2 text-[18px] bg-bfpNavy rounded-2xl text-white active:bg-bfpOrange mb-2 transform transition duration-300 hover:scale-105 hover:shadow-lg hover:bg-hoverBtn">
            Save Recordings
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileMonitoring;
