import React from 'react';
import mean from 'lodash/mean';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart as RechartsBarChart,
  Bar,
} from 'recharts';

// Custom Tooltip for both charts
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

// Header
const ChartHeader = ({ title, description }) => (
  <div className="relative p-3 bg-bfpOrange rounded-t-lg text-white">
    <h3 className="text-lg font-bold">{title}</h3>
    <p className="text-sm">{description}</p>
  </div>
);

export const BarChart = ({ data, xKey, yKey, color, title, description, yLabel, unit }) => {

  return (
    <div className="h-96 w-full lg:w-[600px] bg-bfpNavy rounded-lg shadow-lg flex flex-col">
      <ChartHeader title={title} description={description} />
      <div className="flex-grow p-4">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart 
            data={data}
            barGap={3}
            barCategoryGap={0}
            margin={{left: 10, right: 10}}
          >
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
            <XAxis 
              dataKey={xKey} 
              tick={{ fill: '#fff', fontSize: 9 }}
              angle={-20}
              interval={0}
              textAnchor="end"
              padding={{left: 10, right: 10}}
            />
            <YAxis
              tick={{ fill: '#fff' }}
              label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: '#fff' }}
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
};

export default BarChart;