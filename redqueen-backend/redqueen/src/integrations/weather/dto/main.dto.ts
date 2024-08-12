export interface MainDTO {
  temp: number;
  feelsLike: number;
  pressure: number;
  humidity: number;
  tempMin: number;
  tempMax: number;
  seaLevel?: number;
  groundLevel?: number;
  tempKf?: number;
}
