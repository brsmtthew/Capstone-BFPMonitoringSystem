import React from 'react';
import HeaderSection from '../header/HeaderSection';
import BodyCard from '../parentCard/BodyCard';
import BodyChart from '../chart/HealthChartSection';
import EnvironmentChartSection from '../chart/EnvironmentChartSection';


const AnalyticsBody = () => {
  return (
    <div className="p-4 min-h-screen flex flex-col lg:bg-white">
      {/* Header Section */}
      <HeaderSection title="ANALYTICS OVERVIEW" />

      {/* Separator */}
      <div className="my-4 h-[2px] bg-separatorLine w-[80%] mx-auto" />

      {/* Grid for Analytics Data */}
      <BodyCard>
        {/* Add a bottom margin to HealthChartSection */}
        <div className="mb-6">
          <BodyChart />
        </div>
        <EnvironmentChartSection />
      </BodyCard>
    </div>
  );
};

export default AnalyticsBody;
