import React from 'react';
import EnviCard from './EnviCard';
import DataCardMonitoring from './DataCardMonitoring';

const EnviMonitoring = ({ monitoringEnviData = [] }) => {
  return (
    <div className="bg-white w-full rounded-lg shadow-md xl:h-96 2xl:h-96">
      <div className="bg-bfpNavy rounded-lg text-center text-white p-4">
        <p className="font-bold text-[26px] font-montserrat">Environmental Monitoring</p>
      </div>
      <div className="font-montserrat flex flex-wrap justify-around lg:grid lg:grid-cols-3 gap-4 mt-4 p-4">
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