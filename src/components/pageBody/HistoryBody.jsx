import React, { useState, useEffect } from 'react';
import sortIcon from "./dashboardAssets/sort.png";
import filterIcon from "./dashboardAssets/filter.png";
import moreIcon from "./dashboardAssets/more.png";
import searchIcon from "./dashboardAssets/glass.png";

function HistoryBody() {
  // Sample state for fetched data (replace with your actual Firebase data fetching logic)
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    // Simulate fetching data from Firebase
    const fetchData = async () => {
      // Replace this with your Firebase fetching logic
      const data = [
        {
          name: 'Ace Bernard Malasaga',
          date: 'December 23, 2025',
          healthSensors: 'Average',
          envSensors: 'Good',
          remarks: 'Average'
        },
        {
          name: 'Ace Bernard Malasaga',
          date: 'December 23, 2025',
          healthSensors: 'Average',
          envSensors: 'Good',
          remarks: 'Average'
        },
        {
          name: 'Ace Bernard Malasaga',
          date: 'December 23, 2025',
          healthSensors: 'Average',
          envSensors: 'Good',
          remarks: 'Average'
        },
        {
          name: 'Ace Bernard Malasaga',
          date: 'December 23, 2025',
          healthSensors: 'Average',
          envSensors: 'Good',
          remarks: 'Average'
        },
        {
          name: 'Ace Bernard Malasaga',
          date: 'December 23, 2025',
          healthSensors: 'Average',
          envSensors: 'Good',
          remarks: 'Average'
        },
        {
          name: 'Ace Bernard Malasaga',
          date: 'December 23, 2025',
          healthSensors: 'Average',
          envSensors: 'Good',
          remarks: 'Average'
        },
        {
          name: 'Ace Bernard Malasaga',
          date: 'December 23, 2025',
          healthSensors: 'Average',
          envSensors: 'Good',
          remarks: 'Average'
        },
        {
          name: 'Ace Bernard Malasaga',
          date: 'December 23, 2025',
          healthSensors: 'Average',
          envSensors: 'Good',
          remarks: 'Average'
        },
        {
          name: 'Ace Bernard Malasaga',
          date: 'December 23, 2025',
          healthSensors: 'Average',
          envSensors: 'Good',
          remarks: 'Average'
        },
        {
          name: 'Ace Bernard Malasaga',
          date: 'December 23, 2025',
          healthSensors: 'Average',
          envSensors: 'Good',
          remarks: 'Average'
        },
        {
          name: 'Ace Bernard Malasaga',
          date: 'December 23, 2025',
          healthSensors: 'Average',
          envSensors: 'Good',
          remarks: 'Average'
        },
        {
          name: 'Ace Bernard Malasaga',
          date: 'December 23, 2025',
          healthSensors: 'Average',
          envSensors: 'Good',
          remarks: 'Average'
        },
        
        // Add more sample data as needed
      ];
      setHistoryData(data);
    };

    fetchData();
  }, []);

  return (
    <div className='p-4 min-h-screen flex flex-col lg:bg-white'>
      {/* Header Section */}
      <div className="flex justify-between items-center gap-x-40 text-black px-4 sm:px-10 md:px-20 lg:px-40">
        {/* Left Column */}
        <div className="flex items-center">
          <div className="h-10 w-2 rounded-full bg-separator mr-2"></div> 
          <p className="text-[26px] font-bold">HISTORY</p>            
        </div>

        {/* Right Column with Dropdown */}
        <div className="ml-4 flex items-center">
          <select className="text-xl text-white bg-primeColor font-semibold border text-center rounded-lg px-4 py-2">
            <option>Select Personnel</option>
            <option>Personnel 1</option>
            <option>Personnel 2</option>
            {/* Add more personnel options as needed */}
          </select>
        </div>
      </div>
      <div className="my-4 h-[2px] bg-separatorLine w-[80%] mx-auto" />

      {/* Icon Section */}
      <div className="flex justify-between items-center my-6 mx-40">
      <button className="text-[18px] border border-separatorLine bg-primeColor text-white px-4 py-2 rounded-lg font-semibold cursor-pointer">
        See All
      </button>
        <div className="flex space-x-4">
          {/* Card for Search Icon */}
          <div className="bg-white p-2 rounded-lg shadow-md flex items-center justify-center cursor-pointer">
            <img src={searchIcon} alt="Search" className="h-8 w-8" />
          </div>
          {/* Card for Sort Icon */}
          <div className="bg-white p-2 rounded-lg shadow-md flex items-center justify-center cursor-pointer">
            <img src={sortIcon} alt="Sort" className="h-8 w-8" />
          </div>
          {/* Card for Filter Icon */}
          <div className="bg-white p-2 rounded-lg shadow-md flex items-center justify-center cursor-pointer">
            <img src={filterIcon} alt="Filter" className="h-8 w-8" />
          </div>
          {/* Card for More Icon */}
          <div className="bg-white p-2 rounded-lg shadow-md flex items-center justify-center cursor-pointer">
            <img src={moreIcon} alt="More" className="h-8 w-8" />
          </div>
        </div>
      </div>


      {/* Table Section */}
      <div className="overflow-x-auto">
      <div className="max-h-[600px] overflow-y-auto w-full flex justify-center">
        <table className="min-w-fit text-[20px]">
          <thead className="bg-histoColor sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left text-white">Name</th>
              <th className="px-4 py-2 text-left text-white">Date</th>
              <th className="px-4 py-2 text-left text-white">Health Related Sensors</th>
              <th className="px-4 py-2 text-left text-white">Environmental Related Sensors</th>
              <th className="px-4 py-2 text-left text-white">Remarks</th>
              <th className="px-4 py-2 text-left text-white">Action</th>
            </tr>
          </thead>
          <tbody className="max-h-[400px] overflow-y-auto text-[18px] text-center">
            {historyData.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2">{entry.name}</td>
                <td className="px-4 py-2">{entry.date}</td>
                <td className="px-4 py-2">{entry.healthSensors}</td>
                <td className="px-4 py-2">{entry.envSensors}</td>
                <td className="px-4 py-2">{entry.remarks}</td>
                <td className="px-4 py-2">
                  <button className="bg-black text-white rounded px-4 py-1">See Full</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}

export default HistoryBody;
