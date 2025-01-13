import React from 'react';
import LineChart  from './LineChart'; // Import the reusable LineChart
import { ResponsiveContainer } from 'recharts';

// Sample Data for Charts
const heartRateData = [
  { time: '10:00', heartRate: 72 },
  { time: '10:05', heartRate: 75 },
  { time: '10:10', heartRate: 70 },
  { time: '10:15', heartRate: 74 },
  { time: '10:20', heartRate: 73 },
  { time: '10:25', heartRate: 76 },
];

const bodyTempData = [
  { time: '10:00', bodyTemp: 36.5 },
  { time: '10:05', bodyTemp: 36.7 },
  { time: '10:10', bodyTemp: 36.6 },
  { time: '10:15', bodyTemp: 36.8 },
  { time: '10:20', bodyTemp: 36.5 },
  { time: '10:25', bodyTemp: 36.7 },
];

const HealthChartSection = () => {
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
            data={heartRateData}
            xKey="time"
            yKey="heartRate"
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
            data={bodyTempData}
            xKey="time"
            yKey="bodyTemp"
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
