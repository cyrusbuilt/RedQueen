export interface CyenvironStatus {
  clientId: string;
  firmwareVersion: string;
  systemState: number;
  altitudeFeet: number;
  gasKohms: number;
  humidity: number;
  pressureHpa: number;
  tempF: number;
  brightness: number;
  lightLevel: number;
  alarm: string;
  iaq: number;
  co2Equivalent: number;
  breathVoc: number;
  dewPoint: number;
  aqi: number;
  lastUpdate: string;
}
