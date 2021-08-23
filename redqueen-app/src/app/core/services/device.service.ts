import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Device } from '../interfaces/device';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private rootUrl: string;

  constructor(private http: HttpClient) {
    this.rootUrl = environment.rootUrl;
  }

  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.rootUrl}/device/list`);
  }
}
