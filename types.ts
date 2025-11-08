
export interface VehicleConfig {
  name: string;
  purchasePrice: number;
  incentives: number; // EV only
  efficiency: number; // MPG or miles/kWh
  energyCost: number; // $/gallon or $/kWh
  maintenance: number;
  repairs: number;
  insurance: number;
}

export interface TcoConfig {
  years: number;
  milesPerYear: number;
  ev: VehicleConfig;
  gas: VehicleConfig;
}

export interface TcoDataPoint {
  year: number;
  evCost: number;
  gasCost: number;
  evCumulative: number;
  gasCumulative: number;
}
