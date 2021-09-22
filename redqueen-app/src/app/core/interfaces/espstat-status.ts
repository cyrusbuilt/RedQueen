export interface EspstatStatus {
  client_id: string;
  systemState: number;
  firmwareVersion: string;
  humidity: number;
  tempC: number;
  tempF: number;
  heatIndexC: number;
  heatIndexF: number;
  mode: number;
  tempAverageF: number;
  isRunning: string;
  auxHeat: string;
  setpoint: number;
}
