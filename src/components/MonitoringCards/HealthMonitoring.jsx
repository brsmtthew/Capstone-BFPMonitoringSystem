import React from 'react';
import HealthCard from './HealthCard';
import DataCardMonitoring from './DataCardMonitoring';

const HealthMonitoring = ({ monitoringHealthData = [] }) => {
  return (
    <div className="bg-white h-96 w-[1020] rounded-lg shadow-md">
      <div className="bg-bfpNavy rounded-lg text-center text-white p-4">
        <p className="font-bold text-[26px]">Health Monitoring</p>
      </div>
      <div className="flex flex-wrap justify-around gap-4 mt-4">
        {monitoringHealthData.map((data, index) => (
          <HealthCard key={index} icon={data.icon} title={data.title}>
            <DataCardMonitoring
              value={data.value}
              description={data.description}
              warningIcon={data.warningIcon}
            />
          </HealthCard>
        ))}
      </div>
    </div>
  );
};

export default HealthMonitoring;
