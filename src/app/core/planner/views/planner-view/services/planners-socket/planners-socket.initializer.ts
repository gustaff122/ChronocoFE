import { inject, Injectable } from '@angular/core';
import { PlannersSocketService } from './planners-socket.service';
import { PlannersSocketReceiverService } from './planners-socket-receiver.service';
import { PlannersSocketSenderService } from './planners-socket-sender.service';

@Injectable()
export class PlannersSocketInitializer {
  private readonly plannersSocket: PlannersSocketService = inject(PlannersSocketService);
  private readonly plannersSocketReceiver: PlannersSocketReceiverService = inject(PlannersSocketReceiverService);
  private readonly plannersSocketSender: PlannersSocketSenderService = inject(PlannersSocketSenderService);

  public init(): void {
    this.plannersSocket.init();
    this.plannersSocketReceiver.init();
    this.plannersSocketSender.init();
  }

  public destroy(): void {
    this.plannersSocket.destroy();
  }
}