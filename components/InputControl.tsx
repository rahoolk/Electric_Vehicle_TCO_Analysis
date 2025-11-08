
import React from 'react';

interface InputControlProps {
  label: string;
  unit?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  isCurrency?: boolean;
}

export const InputControl: React.FC<InputControlProps> = ({
  label,
  unit,
  value,
  onChange,
  min,
  max,
  step,
  isCurrency = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  const formatValue = (val: number) => {
    if (isCurrency) {
      return val.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    return val.toLocaleString('en-US');
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <span className="px-2 py-1 text-xs font-semibold text-brand-200 bg-brand-900 rounded-md">
          {isCurrency && '$'}
          {value.toLocaleString('en-US', { minimumFractionDigits: isCurrency ? 0 : (step < 1 ? 2 : 0), maximumFractionDigits: isCurrency ? 0 : 2 })}
          {!isCurrency && unit && ` ${unit}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb:bg-brand-500"
      />
    </div>
  );
};
