import React from 'react';
import HealthCard from './HealthCard';

const HealthMonitoring = ({ monitoringHealthData = [] }) => {
  return (
    <div className="bg-white w-full rounded-lg shadow-md xl:h-96 2xl:h-96">
      <div className="bg-bfpNavy rounded-lg text-center text-white p-4">
        <p className="font-bold text-[26px] font-montserrat text-white">Health Monitoring</p>
      </div>
      <div className="font-montserrat flex flex-wrap sm:flex-col md:flex-row justify-around gap-4 mt-4">
        {monitoringHealthData.map((data, index) => (
          <HealthCard 
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
};

export default HealthMonitoring;