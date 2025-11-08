
import React, { useState } from 'react';
import type { TcoDataPoint } from '../types';
import { ChevronDownIcon } from './icons';

interface DataTableProps {
  data: TcoDataPoint[];
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left font-semibold text-white focus:outline-none"
      >
        <span>View Detailed Year-by-Year Data</span>
        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="overflow-x-auto p-4">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Year</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">EV Annual Cost</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">EV Cumulative</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-400 uppercase tracking-wider">Gas Annual Cost</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-400 uppercase tracking-wider">Gas Cumulative</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {data.map((row) => (
                <tr key={row.year}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{row.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatCurrency(row.evCost)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatCurrency(row.evCumulative)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatCurrency(row.gasCost)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatCurrency(row.gasCumulative)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
