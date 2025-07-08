import React from 'react';
import HealthCard from './HealthCard';
import EnviCard from './EnviCard';

const RealTime = ({
  monitoringHealthData = [],
  monitoringEnviData = [],
  gearId,
  onRemove
}) => {
  return (
    <div className="bg-white w-full h-full rounded-lg shadow-md">
      {/* Header */}
      <div className="bg-bfpNavy rounded-t-lg text-center text-white p-3">
        <p className="font-bold sm:text-[18px] md:text-[22px] lg:text-[24px] font-montserrat">
          Real-Time Monitoring
        </p>
      </div>

      {/* Cards Grid */}
      <div className="font-montserrat grid gap-7 grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 mt-2 p-4 ">
        {/* Health Cards */}
        {monitoringHealthData.map((data, index) => (
          <div key={`health-${index}`} className="col-span-1">
            <HealthCard
              icon={data.icon}
              title={data.title}
              value={data.value}
              description={data.description}
              warningIcon={data.warningIcon}
            />
          </div>
        ))}

        {/* Environmental Cards */}
        {monitoringEnviData.map((data, index) => (
          <div key={`envi-${index}`} className="col-span-1">
            <EnviCard
              icon={data.icon}
              title={data.title}
              value={data.value}
              description={data.description}
              warningIcon={data.warningIcon}
            />
          </div>
        ))}
      </div>
      <div className="p-4 mt-auto">
        <button
          className="w-fit px-4 py-2 bg-red hover:bg-hoverBtn text-white rounded-lg hover:bg-red-600"
          onClick={() => onRemove(gearId)}
        >
          Remove from Monitoring
        </button>
      </div>
    </div>
  );
};

export default RealTime;
