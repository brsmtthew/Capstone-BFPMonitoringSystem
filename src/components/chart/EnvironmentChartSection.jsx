import React from 'react';
import LineChart from './LineChart';
import BarChart from './BarChart';
import GaugeChart from './GaugeChart';

// Sample Data for Charts
const smokeData = [
  { time: '10:00', value: 50 },
  { time: '10:05', value: 60 },
  { time: '10:10', value: 55 },
  { time: '10:15', value: 58 },
  { time: '10:20', value: 62 },
  { time: '10:25', value: 70 },
];

const toxicGasData = [
  { name: 'Toxic Gas Level', value: 60 },
];

const environmentalTempData = [
  { time: '10:00', temp: 25 },
  { time: '10:05', temp: 25.5 },
  { time: '10:10', temp: 26 },
  { time: '10:15', temp: 26.5 },
  { time: '10:20', temp: 27 },
  { time: '10:25', temp: 27.5 },
];

const EnvironmentChartSection = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col text-center h-auto max-w-full">
      {/* Section Header */}
      <div className="p-3 w-full bg-bfpNavy rounded-lg mb-4 text-white">
        <h3 className="text-white text-[24px] font-bold">Environmental Analytics</h3>
      </div>

      {/* Grid Layout for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-x-auto mb-4">
        {/* Smoke Detection - Bar Chart (First Column, First Row) */}
        <div className="flex justify-center col-span-1">
          <BarChart
            data={smokeData}
            xKey="time"
            yKey="value"
            color="#FF7300" // bfpOrange
            title="Smoke Detection"
            description="This chart shows the smoke levels detected over time."
            yLabel="Level"
            unit="PPM"
          />
        </div>

        {/* Toxic Gas - Gauge Chart (Second Column, First Row) */}
        <div className="flex justify-center col-span-1">
          <GaugeChart
            data={toxicGasData}
            cx="50%"
            cy="50%"
            innerRadius="30%"
            outerRadius="80%"
            fill="#FF7300" // bfpOrange
            title="Toxic Gas Detection"
            description="This gauge shows the current toxic gas level."
          />
        </div>
      </div>

      {/* Environmental Temperature - Line Chart (Second Row, Full Width) */}
      <div className="flex justify-center col-span-2 mb-4">
        <LineChart
          data={environmentalTempData}
          xKey="time"
          yKey="temp"
          color="#4CAF50" // Green for temperature
          title="Environmental Temperature"
          description="This chart displays the environmental temperature over time."
          yLabel="°C"
          unit="°C"
        />
      </div>
    </div>
  );
};

export default EnvironmentChartSection;
