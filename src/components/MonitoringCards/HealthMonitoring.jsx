import React from 'react';
import HealthCard from './HealthCard';

const HealthMonitoring = ({ monitoringHealthData = [] }) => {
  return (
    <div className="bg-white w-full rounded-lg shadow-md xl:h-96 2xl:h-96">
      <div className="bg-bfpNavy rounded-lg text-center text-white p-4">
        <p className="font-bold sm:text-[18px] md:text-[22px] lg:text-[26px] font-montserrat text-white">
          Health Monitoring
        </p>
      </div>
      <div className="font-montserrat grid gap-4 grid-cols-1 sm:grid-cols-2 mt-4 p-4">
        {monitoringHealthData.map((data, index) => (
          <div key={index} className="col-span-1">
            <HealthCard 
              icon={data.icon} 
              title={data.title}
              value={data.value}
              description={data.description}
              warningIcon={data.warningIcon}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthMonitoring;
