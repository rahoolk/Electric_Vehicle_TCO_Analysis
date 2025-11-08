
import React, { useState, useMemo, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { SummaryCard } from './components/SummaryCard';
import { TcoChart } from './components/TcoChart';
import { DataTable } from './components/DataTable';
import { BoltIcon, CarIcon } from './components/icons';
import { fetchNationalAverages } from './services/geminiService';
import type { TcoConfig, TcoDataPoint } from './types';

const INITIAL_CONFIG: TcoConfig = {
  years: 10,
  milesPerYear: 12000,
  ev: {
    name: 'Tesla Model Y',
    purchasePrice: 57000,
    incentives: 7500,
    efficiency: 3.5,
    energyCost: 0.17,
    maintenance: 950,
    repairs: 500,
    insurance: 2100,
  },
  gas: {
    name: 'Toyota RAV4',
    purchasePrice: 48000,
    incentives: 0,
    efficiency: 25,
    energyCost: 3.60,
    maintenance: 1200,
    repairs: 800,
    insurance: 1900,
  }
};

const App: React.FC = () => {
  const [config, setConfig] = useState<TcoConfig>(INITIAL_CONFIG);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchAverages = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const averages = await fetchNationalAverages(config.ev.name, config.gas.name);
      setConfig(prev => ({
        ...prev,
        ev: { ...prev.ev, ...averages.ev },
        gas: { ...prev.gas, ...averages.gas },
      }));
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsFetching(false);
    }
  }, [config.ev.name, config.gas.name]);

  const tcoData = useMemo<TcoDataPoint[]>(() => {
    const { years, milesPerYear, ev, gas } = config;
    
    const annualEvEnergyCost = (milesPerYear / ev.efficiency) * ev.energyCost;
    const annualGasEnergyCost = (milesPerYear / gas.efficiency) * gas.energyCost;

    const totalAnnualEvCost = annualEvEnergyCost + ev.maintenance + ev.repairs + ev.insurance;
    const totalAnnualGasCost = annualGasEnergyCost + gas.maintenance + gas.repairs + gas.insurance;

    const initialEvCost = ev.purchasePrice - ev.incentives;
    const initialGasCost = gas.purchasePrice;

    let cumulativeEv = initialEvCost;
    let cumulativeGas = initialGasCost;

    const data: TcoDataPoint[] = [{
      year: 0,
      evCost: initialEvCost,
      gasCost: initialGasCost,
      evCumulative: initialEvCost,
      gasCumulative: initialGasCost,
    }];

    for (let year = 1; year <= years; year++) {
      cumulativeEv += totalAnnualEvCost;
      cumulativeGas += totalAnnualGasCost;
      data.push({
        year,
        evCost: totalAnnualEvCost,
        gasCost: totalAnnualGasCost,
        evCumulative: cumulativeEv,
        gasCumulative: cumulativeGas,
      });
    }

    return data;
  }, [config]);

  const lastYearData = tcoData[tcoData.length - 1];
  const evSummary = {
    initialCost: tcoData[0].evCumulative,
    annualEnergyCost: (config.milesPerYear / config.ev.efficiency) * config.ev.energyCost,
    totalAnnualCost: tcoData[1]?.evCost ?? 0,
    totalCost: lastYearData.evCumulative,
  };
   const gasSummary = {
    initialCost: tcoData[0].gasCumulative,
    annualEnergyCost: (config.milesPerYear / config.gas.efficiency) * config.gas.energyCost,
    totalAnnualCost: tcoData[1]?.gasCost ?? 0,
    totalCost: lastYearData.gasCumulative,
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar config={config} setConfig={setConfig} onFetchAverages={handleFetchAverages} isFetching={isFetching} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-900">
        <div className="max-w-7xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-white">Cost Analysis Dashboard</h2>
            {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SummaryCard
                    title={config.ev.name}
                    icon={<BoltIcon className="w-6 h-6 text-green-400"/>}
                    {...evSummary}
                    years={config.years}
                />
                <SummaryCard
                    title={config.gas.name}
                    icon={<CarIcon className="w-6 h-6 text-red-400"/>}
                    {...gasSummary}
                    years={config.years}
                />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-white mb-4">Cumulative TCO Chart</h3>
                <TcoChart data={tcoData} />
            </div>
            <div>
                <DataTable data={tcoData} />
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
