import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../../../../environments/environment';

@Injectable()
export class PlannersSocketService {
  public socket: Socket = null;

  public init(): void {
    this.socket = io(environment.SOCKET_PLANNER_URL, { withCredentials: true });
  }

  public destroy(): void {
    this.socket.disconnect();
  }
}