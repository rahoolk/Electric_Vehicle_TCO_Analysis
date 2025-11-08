
import React from 'react';
import type { TcoConfig } from '../types';
import { InputControl } from './InputControl';
import { BoltIcon, CarIcon, DownloadIcon } from './icons';

interface SidebarProps {
  config: TcoConfig;
  setConfig: React.Dispatch<React.SetStateAction<TcoConfig>>;
  onFetchAverages: () => void;
  isFetching: boolean;
}

const VehicleInputGroup: React.FC<{
  title: string;
  icon: React.ReactNode;
  config: TcoConfig;
  setConfig: React.Dispatch<React.SetStateAction<TcoConfig>>;
  vehicleType: 'ev' | 'gas';
}> = ({ title, icon, config, setConfig, vehicleType }) => {
  
  const vehicle = config[vehicleType];

  const handleTextChange = (field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      [vehicleType]: { ...prev[vehicleType], [field]: value }
    }));
  };
  
  const handleNumericChange = (field: string, value: number) => {
    if (isNaN(value)) return;
    setConfig(prev => ({
      ...prev,
      [vehicleType]: { ...prev[vehicleType], [field]: value }
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div>
          <label className="text-sm font-medium text-gray-400">Model Name</label>
          <input
              type="text"
              value={vehicle.name}
              onChange={(e) => handleTextChange('name', e.target.value)}
              className="mt-1 w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder={vehicleType === 'ev' ? 'e.g., Tesla Model Y' : 'e.g., Toyota RAV4'}
          />
      </div>
      <InputControl label="Purchase Price" value={vehicle.purchasePrice} onChange={(v) => handleNumericChange('purchasePrice', v)} min={10000} max={150000} step={500} isCurrency />
      {vehicleType === 'ev' && (
        <InputControl label="Incentives/Rebates" value={vehicle.incentives} onChange={(v) => handleNumericChange('incentives', v)} min={0} max={20000} step={250} isCurrency />
      )}
      <InputControl label={vehicleType === 'ev' ? "Electricity Cost" : "Gas Price"} unit={vehicleType === 'ev' ? "$/kWh" : "$/gallon"} value={vehicle.energyCost} onChange={(v) => handleNumericChange('energyCost', v)} min={0.05} max={vehicleType === 'ev' ? 1 : 10} step={0.01} />
      <InputControl label="Efficiency" unit={vehicleType === 'ev' ? "miles/kWh" : "MPG"} value={vehicle.efficiency} onChange={(v) => handleNumericChange('efficiency', v)} min={1} max={vehicleType === 'ev' ? 10 : 100} step={vehicleType === 'ev' ? 0.1 : 1} />
      <InputControl label="Annual Maintenance" value={vehicle.maintenance} onChange={(v) => handleNumericChange('maintenance', v)} min={0} max={5000} step={50} isCurrency />
      <InputControl label="Annual Repairs" value={vehicle.repairs} onChange={(v) => handleNumericChange('repairs', v)} min={0} max={5000} step={50} isCurrency />
      <InputControl label="Annual Insurance" value={vehicle.insurance} onChange={(v) => handleNumericChange('insurance', v)} min={0} max={10000} step={100} isCurrency />
    </div>
  );
};


export const Sidebar: React.FC<SidebarProps> = ({ config, setConfig, onFetchAverages, isFetching }) => {
  const handleGeneralChange = (field: 'years' | 'milesPerYear', value: number) => {
    if (isNaN(value)) return;
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <aside className="w-full lg:w-96 bg-gray-950 p-6 space-y-8 overflow-y-auto lg:h-screen lg:sticky lg:top-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">TCO Calculator</h1>
        <p className="text-sm text-gray-400">Compare EV vs. Gas long-term costs.</p>
      </div>

      <button
        onClick={onFetchAverages}
        disabled={isFetching}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-brand-500 disabled:bg-brand-800 disabled:cursor-not-allowed transition-colors"
      >
        {isFetching ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <DownloadIcon className="w-4 h-4" />
        )}
        <span>{isFetching ? 'Fetching...' : 'Load National Averages'}</span>
      </button>

      <div className="space-y-4 border-t border-gray-800 pt-6">
        <h3 className="text-lg font-semibold text-gray-200">General Assumptions</h3>
        <InputControl label="Years to Compare" unit="years" value={config.years} onChange={(v) => handleGeneralChange('years', v)} min={1} max={20} step={1} />
        <InputControl label="Annual Miles Driven" unit="miles" value={config.milesPerYear} onChange={(v) => handleGeneralChange('milesPerYear', v)} min={1000} max={50000} step={500} />
      </div>

      <div className="border-t border-gray-800 pt-6">
        <VehicleInputGroup
          title="Electric Vehicle"
          icon={<BoltIcon className="w-5 h-5 text-green-400" />}
          config={config}
          setConfig={setConfig}
          vehicleType="ev"
        />
      </div>

      <div className="border-t border-gray-800 pt-6">
        <VehicleInputGroup
          title="Gasoline Vehicle"
          icon={<CarIcon className="w-5 h-5 text-red-400" />}
          config={config}
          setConfig={setConfig}
          vehicleType="gas"
        />
      </div>
    </aside>
  );
};
