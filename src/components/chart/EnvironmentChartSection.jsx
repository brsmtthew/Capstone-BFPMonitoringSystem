import React from 'react';
import LineChart from './LineChart';
import BarChart from './BarChart';
import { ResponsiveContainer } from 'recharts';
import Overview from './Overview';

const EnvironmentChartSection = ({ smokeData, enviData, ToxicGas, HeartRate, temperatureData }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col text-center h-auto max-w-full">
      {/* Section Header */}
      <div className="p-3 w-full bg-bfpNavy rounded-lg mb-4 text-white">
        <h3 className="text-white text-[24px] font-bold">Environmental Analytics</h3>
      </div>

      {/* Grid Layout for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-x-auto mb-4">
        {/* Smoke Detection - Bar Chart (First Column, First Row) */}
        <ResponsiveContainer>
          <div className="flex justify-center col-span-1">
            <BarChart
              data={smokeData}
              xKey="time"
              yKey="value"
              color="#000435"
              title="Smoke Detection"
              description="This chart shows the smoke levels detected over time."
              yLabel="Level"
              unit="PPM"
            />
          </div>
        </ResponsiveContainer>

        {/* Toxic Gas - Bar Chart (Second Column, First Row) */}
        <ResponsiveContainer>
        <div className="flex justify-center col-span-1">
          <BarChart
            data={ToxicGas}
            xKey="time"
            yKey="value"
            color="#FF7300"
            title="Toxic Gas Detection"
            description="This chart shows the toxic gas levels detected over time."
            yLabel="Level"
            unit="PPM"
          />
        </div>
        </ResponsiveContainer>

        {/* Environmental Temperature - Line Chart (Second Row, First Column) */}
        <ResponsiveContainer>
        <div className="flex justify-center col-span-1">
          <LineChart
            data={enviData}
            xKey="time"
            yKey="value"
            color="#4CAF50"
            title="Environmental Temperature"
            description="This chart displays the environmental temperature over time."
            yLabel="°C"
            unit="°C"
          />
        </div>
        </ResponsiveContainer>

        {/* Overview - (Second Row, Second Column) */}
        <ResponsiveContainer>
        <div className="flex justify-center col-span-1">
          <Overview
            HeartRate={HeartRate}
            temperatureData={temperatureData}
            smokeData={smokeData}
            enviData={enviData}
            ToxicGas={ToxicGas}
          />
        </div>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnvironmentChartSection;
