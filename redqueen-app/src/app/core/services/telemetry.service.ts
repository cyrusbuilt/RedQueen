import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { MqttBroker } from '../interfaces/mqtt-broker';
import { MqttTopic } from '../interfaces/mqtt-topic';
import { PaginatedList } from '../interfaces/paginated-list';
import { MqttMessage } from '../interfaces/mqtt-message';
import { RedQueenSystemStatus } from '../interfaces/red-queen-system-status';
import { SystemTelemetry } from '../interfaces/system-telemetry';

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

  getBrokerById(id: number): Observable<MqttBroker | null> {
    return this.http.get<MqttBroker | null>(`${this.rootUrl}/telemetry/brokers/${id}`);
  }

  getTopics(): Observable<MqttTopic[]> {
    return this.http.get<MqttTopic[]>(`${this.rootUrl}/telemetry/topics`);
  }

  updateTopic(id: number, topic: MqttTopic): Observable<MqttTopic | null> {
    return this.http.put<MqttTopic | null>(`${this.rootUrl}/telemetry/topics/${id}`, topic);
  }

  addTopic(topic: MqttTopic): Observable<MqttTopic | null> {
    return this.http.post<MqttTopic | null>(`${this.rootUrl}/telemetry/topics/add`, topic);
  }

  getTopicsForBroker(id: number): Observable<MqttTopic[]> {
    return this.http.get<MqttTopic[]>(`${this.rootUrl}/telemetry/brokers/${id}/topics`);
  }

  getMessages(pageSize: number, currentPage: number): Observable<PaginatedList<MqttMessage>> {
    return this.http.get<PaginatedList<MqttMessage>>(`${this.rootUrl}/telemetry/messages`,
      {params: {'pageSize': pageSize, 'currentPage': currentPage }});
  }

  getSystemTelemetry(): Observable<SystemTelemetry> {
    return this.http.get<SystemTelemetry>(`${this.rootUrl}/telemetry/systemTelemetry`);
  }
}
