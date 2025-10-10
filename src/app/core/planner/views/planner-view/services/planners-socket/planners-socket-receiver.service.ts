import { inject, Injectable } from '@angular/core';
import { PlannersSocketMessages } from '../../models/planners-socket-messages';
import { PlannersSocketData } from '../../models/planners-socket-data';
import { PlannersSocketService } from './planners-socket.service';
import { SchedulerPresenceStore } from '../../stores/scheduler-presence.store';

@Injectable()
export class PlannersSocketReceiverService {
  private readonly socketService: PlannersSocketService = inject(PlannersSocketService);
  private readonly presenceStore: SchedulerPresenceStore = inject(SchedulerPresenceStore);

  public init(): void {
    this.handleSocketMessages();
  }

  public handleSocketMessages(): void {
    this.socketService.socket.on(
      PlannersSocketMessages.PRESENCE_SNAPSHOT,
      (data: PlannersSocketData[PlannersSocketMessages.PRESENCE_SNAPSHOT]) => {
        this.presenceStore.setPresentUsers(data.users);
      },
    );

    this.socketService.socket.on(
      PlannersSocketMessages.USER_JOINED,
      (data: PlannersSocketData[PlannersSocketMessages.USER_JOINED]) => {
        this.presenceStore.joinUser(data.users[0].name);
      },
    );

    this.socketService.socket.on(
      PlannersSocketMessages.USER_LEFT,
      (data: PlannersSocketData[PlannersSocketMessages.USER_LEFT]) => {
        this.presenceStore.leaveUser(data.username);
      },
    );
  }
}