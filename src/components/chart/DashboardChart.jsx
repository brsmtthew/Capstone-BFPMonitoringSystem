import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Custom tooltip (optional)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow-md text-sm">
        <p className="font-bold">Time: {label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardChart = ({ data = [], personnelInfo = {} }) => {
  // Transform the fetched realTimeData into the shape the chart expects
  const combinedData = data.map((item) => ({
    time: item.time || "N/A",
    heartRate: item.HeartRate || 0,
    bodyTemp: item.bodyTemperature || 0,
    smoke: item.smokeSensor || 0,
    envTemp: item.environmentalTemperature || 0,
    toxic: item.ToxicGasSensor || 0,
  }));

  // Use the personnelInfo prop for the header display.
  const personnelName = personnelInfo.personnelName || "Unknown";
  const personnelGearId = personnelInfo.gearId || "N/A";
  const personnelDate = personnelInfo.date || "N/A";

  return (
    <div className="h-full max-h-full w-full max-w-full bg-bfpNavy rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-3 bg-bfpNavy rounded-t-lg text-white text-center">
        <h3 className="text-lg font-bold">Sensor Data Overview</h3>
        <p className="text-sm">Periodic Sensor Readings</p>
      </div>

      {/* Personnel Info Display */}
      <div className="flex justify-center items-center space-x-4 p-2 text-white font-bold text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]">
        <span>Sensor Readings for: {personnelName}</span>
        <span>Gear ID: {personnelGearId}</span>
        <span>Date: {personnelDate}</span>
      </div>


      {/* Chart */}
      <div className="flex-grow p-4 h-96 w-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData}>
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
            <XAxis dataKey="time" tick={{ fill: "#fff" }} />
            <YAxis tick={{ fill: "#fff" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="heartRate"
              stroke="#ff0000"
              name="Heart Rate"
            />
            <Line
              type="monotone"
              dataKey="smoke"
              stroke="#ff7300"
              name="Smoke"
            />
            <Line
              type="monotone"
              dataKey="toxic"
              stroke="#0088FE"
              name="Toxic CO"
            />
            <Line
              type="monotone"
              dataKey="bodyTemp"
              stroke="#00C49F"
              name="Body Temp"
            />
            <Line
              type="monotone"
              dataKey="envTemp"
              stroke="#FFBB28"
              name="Env Temp"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardChart;
