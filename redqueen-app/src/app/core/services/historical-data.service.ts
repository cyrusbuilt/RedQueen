import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MqttMessage } from '../interfaces/mqtt-message';

@Injectable({
  providedIn: 'root'
})
export class HistoricalDataService {
  private rootUrl: string;

  constructor(private http: HttpClient) {
    this.rootUrl = environment.rootUrl;
  }

  getHistoricalMessages(topicId: number, numDays: number): Observable<MqttMessage[]> {
    return this.http.get<MqttMessage[]>(`${this.rootUrl}/historicalData/messages`,
      { params: { 'topicId': topicId, 'numDays': numDays }});
  }
}
