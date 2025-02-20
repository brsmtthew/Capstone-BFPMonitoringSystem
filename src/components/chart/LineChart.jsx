import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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

const LineChart = ({ data, xKey, yKey, color, title, description, yLabel, unit }) => (
  <div className="h-96 w-full lg:w-[600px] bg-bfpNavy rounded-lg shadow-lg flex flex-col">
    {/* Header */}
    <div className="p-3 bg-bfpOrange rounded-t-lg text-white">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>

    {/* Chart */}
    <div className="flex-grow p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
          <XAxis dataKey={xKey} tick={{ fill: '#b59d38' }} />
          <YAxis
            tick={{ fill: '#b59d38' }}
            label={{
              value: yLabel,
              angle: -90,
              position: 'insideLeft',
              fill: '#b59d38',
            }}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={color}
            strokeWidth={3}
            dot={{ stroke: color, strokeWidth: 2, fill: '#fff' }}
            activeDot={{ r: 8, fill: color }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default LineChart;
