import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class DataContext {
  private readonly _type: string;
  private _host: string;
  private _port: number;
  private _username: string;
  private _password: string;
  private _database: string;

  constructor() {
    this._type = 'postgres';
  }

  get type(): string {
    return this._type;
  }

  get host(): string {
    return this._host;
  }

  get port(): number {
    return this._port;
  }

  get username(): string {
    return this._username;
  }

  get password(): string {
    return this._password;
  }

  get database(): string {
    return this._database;
  }

  public setHost(host: string): void {
    this._host = host;
  }

  public setPort(port: number): void {
    this._port = port;
  }

  public setUsername(username: string): void {
    this._username = username;
  }

  public setPassword(password: string): void {
    this._password = password;
  }

  public setDatabase(database: string): void {
    this._database = database;
  }

  toTypeOrmModuleOptions(): TypeOrmModuleOptions {
    return {
      type: this._type,
      host: this._host,
      port: this._port,
      username: this._username,
      password: this._password,
      database: this._database,
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
      logNotifications: true,
      installExtensions: true,
      useUTC: false,
    } as TypeOrmModuleOptions;
  }
}

export class DataContextBuilder {
  private readonly context: DataContext;

  constructor() {
    this.context = new DataContext();
  }

  public setHost(host: string): DataContextBuilder {
    this.context.setHost(host);
    return this;
  }

  public setPort(port: number): DataContextBuilder {
    this.context.setPort(port);
    return this;
  }

  public setUsername(username: string): DataContextBuilder {
    this.context.setUsername(username);
    return this;
  }

  public setPassword(password: string): DataContextBuilder {
    this.context.setPassword(password);
    return this;
  }

  public setDatabase(database: string): DataContextBuilder {
    this.context.setDatabase(database);
    return this;
  }

  public build(): DataContext {
    return this.context;
  }
}
