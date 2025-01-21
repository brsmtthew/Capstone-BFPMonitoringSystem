import React from 'react';
import LineChart  from './LineChart'; // Import the reusable LineChart
import { ResponsiveContainer } from 'recharts';


const HealthChartSection = ({HeartRate,temperatureData}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col text-center h-auto">
      <div className="p-3 w-full bg-bfpNavy rounded-lg mb-4 text-white">
        <h3 className="text-white text-[24px] font-bold">Health Analytics</h3>
      </div>

      {/* Center the grid and ensure the charts are centered */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center mb-4">
        {/* Heart Rate Chart */}

        <ResponsiveContainer>
          <LineChart
            data={HeartRate}
            xKey="time"
            yKey="value"
            color="#FF7300" // bfpOrange
            title="Heart Rate"
            yLabel="BPM"
            description="This chart shows heart rate trends over time."
            unit="BPM"
          />
        </ResponsiveContainer>
        

        {/* Body Temperature Chart */}
        <ResponsiveContainer>
          <LineChart
            data={temperatureData}
            xKey="time"
            yKey="value"
            color="#0088FE" // bfpBlue
            title="Body Temperature"
            yLabel="°C"
            description="This chart shows body temperature trends over time."
            unit="°C"
          />
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HealthChartSection;
