import { inject, Injectable } from '@angular/core';
import { PlannersSocketMessages } from '../../models/planners-socket-messages';
import { PlannersSocketData } from '../../models/planners-socket-data';
import { PlannersSocketService } from './planners-socket.service';
import { SchedulerPresenceStore } from '../../stores/scheduler-presence.store';
import { SchedulerLegendStore } from '../../stores/scheduler-legend.store';
import { SchedulerInstancesStore } from '../../stores/scheduler-instances.store';

@Injectable()
export class PlannersSocketReceiverService {
  private readonly socketService: PlannersSocketService = inject(PlannersSocketService);
  private readonly presenceStore: SchedulerPresenceStore = inject(SchedulerPresenceStore);
  private readonly legendStore: SchedulerLegendStore = inject(SchedulerLegendStore);
  private readonly instancesStore: SchedulerInstancesStore = inject(SchedulerInstancesStore);

  public init(): void {
    this.handleSocketMessages();
  }

  public handleSocketMessages(): void {
    this.socketService.socket.on(
      PlannersSocketMessages.PRESENCE_SNAPSHOT,
      (data: PlannersSocketData[PlannersSocketMessages.PRESENCE_SNAPSHOT]) => {
        this.presenceStore.setPresentUsers(data.users);
        this.legendStore.initLegends(data.planner?.legends);
        this.instancesStore.initInstances(data.planner?.instances);
      },
    );

    this.socketService.socket.on(
      PlannersSocketMessages.USER_JOINED,
      (data: PlannersSocketData[PlannersSocketMessages.USER_JOINED]) => {
        this.presenceStore.joinUser(data.user);
      },
    );

    this.socketService.socket.on(
      PlannersSocketMessages.USER_LEFT,
      (data: PlannersSocketData[PlannersSocketMessages.USER_LEFT]) => {
        this.presenceStore.leaveUser(data.username);
      },
    );

    this.socketService.socket.on(
      PlannersSocketMessages.LEGEND_ADDED,
      (data: PlannersSocketData[PlannersSocketMessages.LEGEND_ADDED]) => {
        this.legendStore.addLegendBySocket(data);
      },
    );

    this.socketService.socket.on(
      PlannersSocketMessages.LEGEND_REMOVED,
      (data: PlannersSocketData[PlannersSocketMessages.LEGEND_REMOVED]) => {
        this.legendStore.removeLegendBySocket(data.id);
        this.instancesStore.deleteBySocketByLegendId(data.id);
      },
    );

    this.socketService.socket.on(
      PlannersSocketMessages.LEGEND_UPDATED,
      (data: PlannersSocketData[PlannersSocketMessages.LEGEND_UPDATED]) => {
        this.legendStore.updateLegendDefinitionBySocket(data);
      },
    );

    this.socketService.socket.on(
      PlannersSocketMessages.INSTANCE_ADDED,
      (data: PlannersSocketData[PlannersSocketMessages.INSTANCE_ADDED ]) => {
        this.instancesStore.addInstanceFromSocket(data);
      },
    );

    this.socketService.socket.on(
      PlannersSocketMessages.INSTANCE_UPDATED,
      (data: PlannersSocketData[PlannersSocketMessages.INSTANCE_UPDATED ]) => {
        this.instancesStore.updateInstanceFromSocket(data);
      },
    );

    this.socketService.socket.on(
      PlannersSocketMessages.INSTANCE_REMOVED,
      (data: PlannersSocketData[PlannersSocketMessages.INSTANCE_REMOVED ]) => {
        this.instancesStore.deleteBySocket(data.id);
      },
    );
  }
}