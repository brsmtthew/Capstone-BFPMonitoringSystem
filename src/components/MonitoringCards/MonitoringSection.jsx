import React from 'react';
import MonitoringCard from '../MonitoringCards/MonitoringCard';

function MonitoringSection({ title, monitoringData, gridCols = 2 }) {
  // Map gridCols to Tailwind classes
  const gridClass =
    gridCols === 1
      ? 'grid-cols-1'
      : gridCols === 2
      ? 'grid-cols-2'
      : gridCols === 3
      ? 'grid-cols-3'
      : 'grid-cols-1'; // Default fallback

  return (
    <div className="rounded-lg shadow bg-white h-96 pb-4">
      <div className=" p-4 rounded-lg shadow bg-bfpNavy"><p className="font-bold text-[26px] text-center">{title}</p></div>
      {/* Apply the computed grid class */}
      <div className={`grid ${gridClass} gap-2 mt-4`}>
        {monitoringData.map((data, index) => (
          <MonitoringCard
            key={index}
            icon={data.icon}
            title={data.title}
            value={data.value}
            description={data.description}
            warningIcon={data.warningIcon}
          />
        ))}
      </div>
    </div>
  );
}

export default MonitoringSection;
