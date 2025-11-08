
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TcoDataPoint } from '../types';

interface TcoChartProps {
  data: TcoDataPoint[];
}

export const TcoChart: React.FC<TcoChartProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value.toFixed(0)}`;
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-md p-4 shadow-lg">
          <p className="font-bold text-white mb-2">{`Year ${label}`}</p>
          <p className="text-green-400">{`EV Cumulative Cost: ${payload[0].value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}`}</p>
          <p className="text-red-400">{`Gas Cumulative Cost: ${payload[1].value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 25,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
          <XAxis 
            dataKey="year" 
            stroke="#a0aec0" 
            tick={{ fill: '#a0aec0', fontSize: 12 }} 
            label={{ value: 'Year', position: 'insideBottom', offset: -15, fill: '#a0aec0' }}
          />
          <YAxis 
            stroke="#a0aec0" 
            tick={{ fill: '#a0aec0', fontSize: 12 }} 
            tickFormatter={formatCurrency}
            label={{ value: 'Cumulative Cost', angle: -90, position: 'insideLeft', fill: '#a0aec0', dx: -25 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#a0aec0' }} />
          <Line type="monotone" dataKey="evCumulative" name="EV Total Cost" stroke="#4ade80" strokeWidth={3} dot={{ r: 4, fill: '#4ade80' }} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="gasCumulative" name="Gas Total Cost" stroke="#f87171" strokeWidth={3} dot={{ r: 4, fill: '#f87171' }} activeDot={{ r: 8 }}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
