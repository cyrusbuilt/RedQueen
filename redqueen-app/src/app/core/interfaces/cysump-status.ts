export interface CysumpStatus {
  client_id: string;
  pumpState: string;
  firmwareVersion: string;
  systemState: number;
  waterLevelPercent: number;
  pitState: string;
  waterDepth: number;
  alarmEnabled: string;
}
