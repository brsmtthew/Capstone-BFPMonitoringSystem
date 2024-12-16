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
    <div className="p-8">
      <h2 className="text-3xl font-semibold mb-6">Analytics Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
