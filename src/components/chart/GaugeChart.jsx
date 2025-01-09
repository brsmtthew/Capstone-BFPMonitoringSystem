import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const GaugeChart = ({ data, cx, cy, innerRadius, outerRadius, fill, title, description }) => (
  <div className="h-96 w-[500px] bg-white rounded-lg shadow-lg flex flex-col">
    {/* Header */}
    <div className="p-3 bg-bfpOrange rounded-t-lg text-white">
      <h3 className="text-2xl font-bold">{title}</h3> {/* Larger text size for the title */}
      <p className="text-base">{description}</p> {/* Larger text size for the description */}
    </div>

    {/* Chart */}
    <div className="flex-grow p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          barSize={20}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            minAngle={15}
            label={{ fill: '#fff', position: 'insideStart' }}
            background
            dataKey="value"
            fill={fill}
          />
          <Tooltip />
          <Legend iconSize={10} width={200} height={210} layout="vertical" verticalAlign="middle" />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default GaugeChart;
