import { inject, Injectable } from '@angular/core';
import { PlannersSocketService } from './planners-socket.service';
import { PlannersClientMessages } from '../../models/planners-socket-messages';
import { PlannersClientPayloads } from '../../models/planners-client-payloads';
import { AuthStore } from '@chronoco/stores/auth-store/auth.store';

@Injectable()
export class PlannersSocketSenderService {
  private readonly socketService: PlannersSocketService = inject(PlannersSocketService);
  private readonly authStore: AuthStore = inject(AuthStore);

  public init(): void {
    this.sendMessage(PlannersClientMessages.JOIN_PLANNER, { eventId: this.authStore.user().selectedEvent });
  }

  public sendMessage<K extends PlannersClientMessages>(message: K, data: PlannersClientPayloads[K]): void {
    this.socketService.socket.emit(message, data);
  }
}