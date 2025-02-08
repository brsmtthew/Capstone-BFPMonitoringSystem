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

const DashboardChart = ({ data = [] }) => {
  // Transform the fetched realTimeData into the shape the chart expects
  const combinedData = data.map((item) => ({
    time: item.time || "N/A",
    heartRate: item.HeartRate || 0,
    bodyTemp: item.bodyTemperature || 0,
    smoke: item.smokeSensor || 0,
    envTemp: item.environmentalTemperature || 0,
    toxic: item.ToxicGasSensor || 0,
  }));

  return (
    <div className="h-96 w-full max-w-[1150px] bg-white rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-3 bg-bfpNavy rounded-t-lg text-white text-center">
        <h3 className="text-lg font-bold">Dashboard Sensor Data</h3>
        <p className="text-sm">Real-time monitoring of sensor readings</p>
      </div>

      {/* Chart */}
      <div className="flex-grow p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData}>
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
            <XAxis dataKey="time" tick={{ fill: "#000" }} />
            <YAxis tick={{ fill: "#000" }} />
            <Tooltip />
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
