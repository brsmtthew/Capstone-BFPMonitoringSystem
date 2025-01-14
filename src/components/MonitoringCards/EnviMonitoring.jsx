import React from 'react';
import EnviCard from './EnviCard';
import DataCardMonitoring from './DataCardMonitoring';

const EnviMonitoring = ({ monitoringEnviData = [] }) => {
  return (
    <div className="bg-white h-96 w-full rounded-lg shadow-md ">
      <div className="bg-bfpNavy rounded-lg text-center text-white p-4">
        <p className="font-bold text-[26px]">Environmental Monitoring</p>
      </div>
      <div className="flex flex-wrap justify-around gap-4 mt-4">
        {monitoringEnviData.map((data, index) => (
          <EnviCard key={index} icon={data.icon} title={data.title}>
            <DataCardMonitoring
              value={data.value}
              description={data.description}
              warningIcon={data.warningIcon}
            />
          </EnviCard>
        ))}
      </div>
    </div>
  );
};

export default EnviMonitoring;