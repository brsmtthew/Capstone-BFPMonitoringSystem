import React from 'react';
import HeaderSection from '../header/HeaderSection';
import BodyCard from '../parentCard/BodyCard';

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
      <HeaderSection
        title="ANALYTICS OVERVIEW"
        />

        
      <div className="my-4 h-[2px] bg-separatorLine w-[80%] mx-auto" />

      {/* Grid for Analytics Data */}
      <BodyCard>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 mx-40">
          {data.map((item) => (
            <div key={item.label} className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-bold">{item.label}</h3>
              <p className="text-lg text-gray-700">{item.value}</p>
            </div>
          ))}
        </div>
      </BodyCard>
    </div>
  );
}

export default AnalyticsBody;
