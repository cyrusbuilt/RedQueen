import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { MqttBroker } from '../interfaces/mqtt-broker';

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  private rootUrl: string;

  constructor(private http: HttpClient) {
    this.rootUrl = environment.rootUrl;
  }

  getBrokers(): Observable<MqttBroker[]> {
    return this.http.get<MqttBroker[]>(`${this.rootUrl}/telemetry/brokers`);
  }

  addBroker(broker: MqttBroker): Observable<MqttBroker | null> {
    return this.http.post<MqttBroker | null>(`${this.rootUrl}/telemetry/brokers/add`, broker);
  }

  updateBroker(id: number, broker: MqttBroker): Observable<MqttBroker | null> {
    return this.http.put<MqttBroker | null>(`${this.rootUrl}/telemetry/brokers/${id}`, broker);
  }
}
