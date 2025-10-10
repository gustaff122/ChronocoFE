import { inject, Injectable } from '@angular/core';
import { PlannersSocketService } from './planners-socket.service';
import { PlannersClientMessages } from '../../models/planners-socket-messages';
import { PlannersClientPayloads } from '../../models/planners-client-payloads';

@Injectable()
export class PlannersSocketSenderService {
  private readonly socketService: PlannersSocketService = inject(PlannersSocketService);

  public init(): void {
    this.sendMessage(PlannersClientMessages.JOIN_PLANNER, { eventId: '01K6BWYWKPSZBA896WN3SS4MXN' });
  }

  public sendMessage<K extends PlannersClientMessages>(message: K, data: PlannersClientPayloads[K]): void {
    this.socketService.socket.emit(message, data);
  }
}