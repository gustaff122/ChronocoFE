import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IUser } from '../auth-service/models/i-user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly API_URL = environment.API_URL;

  public getUsers(): Observable<IUser[]> {
    return this.httpClient.get<IUser[]>(`${this.API_URL}/users`, {});
  }

  public addUser(userDto: Pick<IUser, 'login' | 'name' | 'password' | 'role'>): Observable<void> {
    return this.httpClient.post<void>(`${this.API_URL}/users`, userDto);
  }

  public grantAccess(userId: string, eventId: string): Observable<void> {
    return this.httpClient.post<void>(`${this.API_URL}/users/${userId}/grant-access`, { eventId });
  }

  public revokeAccess(userId: string, eventId: string): Observable<void> {
    return this.httpClient.post<void>(`${this.API_URL}/users/${userId}/revoke-access`, { eventId });
  }
}