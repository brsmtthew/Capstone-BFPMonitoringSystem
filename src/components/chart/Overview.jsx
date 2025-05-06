import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Overview = ({ HeartRate, temperatureData, smokeData, enviData, ToxicGas }) => {
  // Combine all data into a single array
  const combinedData = HeartRate.map((item, index) => ({
    time: item.time,
    heartRate: item.value,
    bodyTemp: temperatureData[index]?.value,
    smoke: smokeData[index]?.value,
    envTemp: enviData[index]?.value,
    toxic: ToxicGas[index]?.value,
  }));

  return (
    <div className="h-96 w-full lg:w-[600px] bg-bfpNavy rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-3 bg-bfpNavy rounded-t-lg text-white">
        <h3 className="text-lg font-bold">Sensor Data Overview</h3>
        <p className="text-sm">Real-time monitoring of all sensor readings</p>
      </div>

      {/* Chart */}
      <div className="flex-grow p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData}>
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
            <XAxis dataKey="time" tick={{ fill: "#fff", fontSize: 9 }} angle={-20} />
            <YAxis tick={{ fill: "#fff" }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="heartRate" stroke="#ff0000" name="Heart Rate" />
            <Line type="monotone" dataKey="smoke" stroke="#ff7300" name="Smoke" />
            <Line type="monotone" dataKey="toxic" stroke="#0088FE" name="Toxic CO" />
            <Line type="monotone" dataKey="bodyTemp" stroke="#00C49F" name="Body Temp" />
            <Line type="monotone" dataKey="envTemp" stroke="#FFBB28" name="Env Temp" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Overview;