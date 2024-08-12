import * as dotenv from 'dotenv';

export default class Configuration {
  public static shared = new Configuration();

  public readonly dbHost: string;
  public readonly dbPort: number;
  public readonly dbName: string;
  public readonly dbUser: string;
  public readonly dbPassword: string;
  public readonly daemonStatusTopic: string;
  public readonly daemonControlTopic: string;
  public readonly weatherApiUrl: string | null;
  public readonly weatherTopic: string | null;
  public readonly weatherLocLat: number;
  public readonly weatherLocLng: number;

  constructor() {
    dotenv.config();

    this.dbHost = process.env.DB_HOST || 'localhost';
    this.dbPort = 5432;
    if (process.env.DB_PORT) {
      this.dbPort = parseInt(process.env.DB_PORT);
    }

    this.dbName = process.env.DB_DATABASE || 'redqueen';
    this.dbUser = process.env.DB_USER || 'postgres';
    this.dbPassword = process.env.DB_PASSWORD || '';
    this.daemonStatusTopic =
      process.env.MQTT_STATUS_TOPIC || 'redqueen/system/status';
    this.daemonControlTopic =
      process.env.MQTT_CONTROL_TOPIC || 'redqueen/system/control';
    this.weatherApiUrl = process.env.WEATHER_API_URL || null;
    this.weatherTopic = process.env.WEATHER_TOPIC || null;

    if (process.env.WEATHER_LOC_LAT && process.env.WEATHER_LOC_LNG) {
      this.weatherLocLat = parseInt(process.env.WEATHER_LOC_LAT);
      this.weatherLocLng = parseInt(process.env.WEATHER_LOC_LNG);
    }
  }
}
