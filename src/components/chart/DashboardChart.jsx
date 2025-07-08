import React, { useMemo } from "react";
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
  const combinedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const baseDate = "1970-01-01";
      const aTime = new Date(`${baseDate} ${a.time}`);
      const bTime = new Date(`${baseDate} ${b.time}`);
      return aTime - bTime;
    });

    return sorted.map((item) => ({
      time: item.time || "N/A",
      bodyTemp: item.bodyTemperature || 0,
      smoke: item.smokeSensor || 0,
      envTemp: item.environmentalTemperature || 0,
      toxic: item.ToxicGasSensor || 0,
    }));
  }, [data]);

  // Statistical functions for filtering
  const mean = (arr) => arr.reduce((sum, v) => sum + v, 0) / arr.length;
  const median = (arr) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  };
  const stdDev = (arr, m) =>
    Math.sqrt(arr.reduce((sum, v) => sum + Math.pow(v - m, 2), 0) / arr.length);
  const mad = (arr, med) => {
    const deviations = arr.map((v) => Math.abs(v - med));
    return median(deviations);
  };

  // Filter combined data by z-score or MAD per metric
  const filteredData = useMemo(() => {
    if (!combinedData.length) return [];

    // extract arrays
    const btValues = combinedData.map((d) => d.bodyTemp);
    const envValues = combinedData.map((d) => d.envTemp);
    const smokeValues = combinedData.map((d) => d.smoke);
    const toxicValues = combinedData.map((d) => d.toxic);

    // compute stats
    const btMean = mean(btValues);
    const btStd = stdDev(btValues, btMean);
    const envMean = mean(envValues);
    const envStd = stdDev(envValues, envMean);

    const smokeMed = median(smokeValues);
    const smokeMad = mad(smokeValues, smokeMed);
    const toxicMed = median(toxicValues);
    const toxicMad = mad(toxicValues, toxicMed);

    // thresholds
    const zThresh = 3;
    const madThresh = 3;

    return combinedData.filter((d) => {
      const btZ = Math.abs((d.bodyTemp - btMean) / btStd);
      const envZ = Math.abs((d.envTemp - envMean) / envStd);
      const smokeZ = Math.abs((0.6745 * (d.smoke - smokeMed)) / smokeMad);
      const toxicZ = Math.abs((0.6745 * (d.toxic - toxicMed)) / toxicMad);

      return (
        btZ <= zThresh &&
        envZ <= zThresh &&
        smokeZ <= madThresh &&
        toxicZ <= madThresh
      );
    });
  }, [combinedData]);

  // Use the personnelInfo prop for the header display.
  const personnelName = personnelInfo.personnelName || "Unknown";
  const personnelGearId = personnelInfo.gearId || "N/A";
  const personnelDate = personnelInfo.date || "N/A";

  return (
    <div className="h-full max-h-full w-full max-w-full bg-bfpNavy rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-3 bg-bfpNavy rounded-t-lg text-white text-center">
        <h3 className="text-lg font-bold">Responder Sensor Trends</h3>
        <p className="text-sm">Sensor Readings Over Time</p>
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
          <LineChart data={filteredData}>
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
            <XAxis dataKey="time" tick={{ fill: "#fff" }} />
            <YAxis tick={{ fill: "#fff" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
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
