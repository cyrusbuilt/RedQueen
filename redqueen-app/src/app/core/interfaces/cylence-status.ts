export interface CylenceStatus {
  clientId: string;
  firmwareVersion: string;
  systemState: number;
  silencerState: "ON" | "OFF";
  lastUpdate: string;
}
