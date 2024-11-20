import React from 'react';

function AnalyticsBody() {
  // Example data
  const data = [
    { label: 'Heart Rate', value: '72 bpm' },
    { label: 'Body Temperature', value: '98.6 °F' },
    { label: 'Environmental Temperature', value: '75 °F' },
    { label: 'Smoke Detector', value: 'No Smoke' },
    { label: 'Toxic Detector', value: 'Safe Levels' },
  ];

  return (
    <div className="p-4 min-h-screen flex flex-col lg:bg-white">
      {/* Header Section */}
      <div className="flex justify-between items-center gap-x-40 text-black px-4 sm:px-10 md:px-20 lg:px-40">
        {/* Left Column */}
        <div className="flex items-center">
          <div className="h-10 w-2 rounded-full bg-separator mr-2"></div> 
          <p className="text-[26px] font-bold">ANALYTICS OVERVIEW</p>            
        </div>
      </div>
      <div className="my-4 h-[2px] bg-separatorLine w-[80%] mx-auto" />

      {/* Grid for Analytics Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 mx-40">
        {data.map((item) => (
          <div key={item.label} className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold">{item.label}</h3>
            <p className="text-lg text-gray-700">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsBody;
