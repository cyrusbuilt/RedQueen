import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PaginatedList } from '../interfaces/paginated-list';
import { Card } from '../interfaces/card';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private rootUrl: string = environment.rootUrl;

  constructor(private http: HttpClient) { }

  getCards(pageSize: number, currentPage: number): Observable<PaginatedList<Card>> {
    return this.http.get<PaginatedList<Card>>(`${this.rootUrl}/card/list`,
      {params: {'pageSize': pageSize, 'currentPage': currentPage }});
  }
}