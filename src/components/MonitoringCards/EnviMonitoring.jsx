import React from 'react';
import EnviCard from './EnviCard';

const EnviMonitoring = ({ monitoringEnviData = [] }) => {
  return (
    <div className="bg-white w-full rounded-lg shadow-md xl:h-96 2xl:h-96">
      <div className="bg-bfpNavy rounded-lg text-center text-white p-4">
        <p className="font-bold text-[26px] font-montserrat">Environmental Monitoring</p>
      </div>
      <div className="font-montserrat grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  mt-4 p-4">
        {monitoringEnviData.map((data, index) => (
        <div
          key={index}
          // For the third card (index 2), span two columns on md and lg screens
          className={index === 2 ? "md:col-span-2 lg:col-span-2 xl:col-span-1" : ""}
        >
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
    </div>
  );
};

export default EnviMonitoring;
