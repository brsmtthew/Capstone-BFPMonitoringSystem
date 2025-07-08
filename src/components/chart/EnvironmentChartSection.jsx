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
        <h3 className="text-white text-[24px] font-bold">Visual Analytics</h3>
      </div>

      {/* Grid Layout for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-x-auto mb-4">
        {/* ✅ Body Temperature - Line Chart (First Column, First Row) */}
        <ResponsiveContainer>
          <div className="flex justify-center col-span-1">
            <LineChart
              data={temperatureData}
              xKey="time"
              yKey="value"
              color="#00C49F" // bfpBlue
              title="Body Temperature Chart"
              yLabel="°C"
              description="This chart shows body temperature trends over time."
              unit="°C"
            />
          </div>
        </ResponsiveContainer>

        {/* ✅ Smoke Detection - Bar Chart (Second Column, First Row) */}
        <ResponsiveContainer>
          <div className="flex justify-center col-span-1">
            <BarChart
              data={smokeData}
              xKey="time"
              yKey="value"
              color="#ff7300"
              title="Smoke Chart"
              description="This chart shows the smoke levels detected over time."
              yLabel="Level"
              unit="PPM"
            />
          </div>
        </ResponsiveContainer>

        {/* ✅ Toxic Gas - Bar Chart (First Column, Second Row) */}
        <ResponsiveContainer>
          <div className="flex justify-center col-span-1">
            <BarChart
              data={ToxicGas}
              xKey="time"
              yKey="value"
              color="#0088FE"
              title="Toxic Gas Chart"
              description="This chart shows the toxic gas levels detected over time."
              yLabel="Level"
              unit="PPM"
            />
          </div>
        </ResponsiveContainer>

        {/* ✅ Environmental Temperature - Line Chart (Second Column, Second Row) */}
        <ResponsiveContainer>
          <div className="flex justify-center col-span-1">
            <LineChart
              data={enviData}
              xKey="time"
              yKey="value"
              color="#FFBB28"
              title="Environmental Temperature Chart"
              description="This chart displays the environmental temperature over time."
              yLabel="°C"
              unit="°C"
            />
          </div>
        </ResponsiveContainer>

        {/* ✅ Overview - (Third Row, Span 2 Columns) */}
        <div className="lg:col-span-2">
          <ResponsiveContainer>
            <div className="flex justify-center">
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
    </div>
  );
};

export default EnvironmentChartSection;
