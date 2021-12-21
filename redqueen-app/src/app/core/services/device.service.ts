import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Device } from '../interfaces/device';
import { PaginatedList } from '../interfaces/paginated-list';

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

  getDevicesPaginated(pageSize: number, currentPage: number): Observable<PaginatedList<Device>> {
    return this.http.get<PaginatedList<Device>>(`${this.rootUrl}/device/list/paginated`,
      { params: {'pageSize': pageSize, 'currentPage': currentPage }});
  }

  updateDevice(id: number, device: Device): Observable<Device | null> {
    return this.http.put<Device | null>(`${this.rootUrl}/device/${id}`, device);
  }

  saveDevice(device: Device): Observable<Device | null> {
    return this.http.post<Device | null>(`${this.rootUrl}/device/add`, device);
  }

  getDeviceClasses(): Observable<string[]> {
    return this.http.get<string[]>(`${this.rootUrl}/device/classes`);
  }
}
