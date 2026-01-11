import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly API_URL = environment.API_URL;

  public grantAccess(userId: string, eventId: string): Observable<void> {
    return this.httpClient.post<void>(`${this.API_URL}/users/${userId}/grant-access`, { eventId });
  }
}