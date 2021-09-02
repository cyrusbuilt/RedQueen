import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PaginatedList } from '../interfaces/paginated-list';
import { Card } from '../interfaces/card';
import { AccessControlUser } from '../interfaces/access-control-user';
import { take } from 'rxjs/operators';

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

  getActiveUsers(): Observable<AccessControlUser[]> {
    return this.http.get<AccessControlUser[]>(`${this.rootUrl}/card/active-users`);
  }

  updateCard(card: Card): Observable<Card | null> {
    return this.http.put<Card | null>(`${this.rootUrl}/card/update`, card);
  }
}
