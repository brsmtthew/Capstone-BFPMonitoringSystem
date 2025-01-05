import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Custom Tooltip for the BarChart
const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bfpNavy text-white p-3 rounded-lg shadow-md">
        <p className="font-bold">Time: {label}</p>
        <p>{`${payload[0].value} ${unit}`}</p>
      </div>
    );
  }
  return null;
};

const BarChart = ({ data, xKey, yKey, color, title, description, yLabel, unit }) => (
  <div className="h-96 w-[500px] bg-white rounded-lg shadow-lg flex flex-col">
    {/* Header */}
    <div className="p-3 bg-bfpOrange rounded-t-lg text-white">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>

    {/* Chart */}
    <div className="flex-grow p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
          <XAxis dataKey={xKey} tick={{ fill: '#000' }} />
          <YAxis
            tick={{ fill: '#000' }}
            label={{
              value: yLabel,
              angle: -90,
              position: 'insideLeft',
              fill: '#000',
            }}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Bar
            dataKey={yKey}
            fill={color}
            stroke={color}
            strokeWidth={2}
            barSize={30}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default BarChart;
