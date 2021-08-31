import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ApplicationUser } from '../interfaces/application-user';
import { LoginHistory } from '../interfaces/login-history';
import { PaginatedList } from '../interfaces/paginated-list';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private rootUrl: string = environment.rootUrl;

  constructor(private http: HttpClient) { }

  getUser(userId: string): Observable<ApplicationUser> {
    return this.http.get<ApplicationUser>(`${this.rootUrl}/user`, {params: { 'userId': userId }});
  }

  getUserList(): Observable<ApplicationUser[]> {
    return this.http.get<ApplicationUser[]>(`${this.rootUrl}/user/list`);
  }

  getUserLoginHistory(userId: string, pageSize: number, currentPage: number): Observable<PaginatedList<LoginHistory>> {
    return this.http.get<PaginatedList<LoginHistory>>(`${this.rootUrl}/user/${userId}/login-history`,
      {params: {'pageSize': pageSize, 'currentPage': currentPage }});
  }
}
