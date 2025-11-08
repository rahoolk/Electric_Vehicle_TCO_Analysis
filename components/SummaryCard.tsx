
import React from 'react';

interface SummaryCardProps {
  title: string;
  icon: React.ReactNode;
  initialCost: number;
  annualEnergyCost: number;
  totalAnnualCost: number;
  totalCost: number;
  years: number;
}

const SummaryMetric: React.FC<{ label: string; value: string; smallText?: string }> = ({ label, value, smallText }) => (
  <div className="flex justify-between items-baseline">
    <p className="text-sm text-gray-400">{label}</p>
    <div className="text-right">
      <p className="text-lg font-semibold text-white">{value}</p>
      {smallText && <p className="text-xs text-gray-500">{smallText}</p>}
    </div>
  </div>
);

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  icon,
  initialCost,
  annualEnergyCost,
  totalAnnualCost,
  totalCost,
  years
}) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 space-y-4 border border-gray-700/50">
      <h3 className="text-xl font-bold text-white flex items-center gap-3">
        {icon}
        {title}
      </h3>
      <div className="space-y-3 pt-2">
        <SummaryMetric label="Initial Cost (Year 0)" value={formatCurrency(initialCost)} />
        <SummaryMetric label="Annual Fuel/Energy Cost" value={formatCurrency(annualEnergyCost)} />
        <SummaryMetric label="Total Annual Running Cost" value={formatCurrency(totalAnnualCost)} />
        <hr className="border-gray-700" />
        <SummaryMetric 
          label={`Total Cost over ${years} Years`} 
          value={formatCurrency(totalCost)} 
          smallText={`Avg. ${formatCurrency(totalCost / years)} / year`}
        />
      </div>
    </div>
  );
};
