import * as dotenv from 'dotenv';

export default class Configuration {
  public static shared = new Configuration();

  public readonly dbHost: string;
  public readonly dbPort: number;
  public readonly dbName: string;
  public readonly dbUser: string;
  public readonly dbPassword: string;
  public readonly serverPort: number;
  public readonly jwtSecret: string;
  public readonly daemonStatusTopic: string;
  public readonly daemonControlTopic: string;

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
    this.jwtSecret = process.env.JWT_SECRET || '';
    this.serverPort = 3000;
    if (process.env.PORT) {
      this.serverPort = parseInt(process.env.PORT);
    }

    this.daemonStatusTopic =
      process.env.MQTT_STATUS_TOPIC || 'redqueen/system/status';
    this.daemonControlTopic =
      process.env.MQTT_CONTROL_TOPIC || 'redqueen/system/control';
  }
}
