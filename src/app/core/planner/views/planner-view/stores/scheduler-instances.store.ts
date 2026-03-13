import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { IInstance, IInstancePayload, IInstancePosition } from '@chronoco/models/i-legend';
import { ulid } from 'ulid';
import { SchedulerGridComponentStore } from '../components/scheduler-grid/scheduler-grid.component.store';
import { PlannersClientMessages } from '../models/planners-socket-messages';
import { PlannersSocketSenderService } from '../services/planners-socket/planners-socket-sender.service';
import { AuthStore } from '@chronoco/stores/auth-store/auth.store';
import { Dialog } from '@angular/cdk/dialog';
import { SchedulerLegendStore } from './scheduler-legend.store';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SchedulerInstancesStore {
  private readonly gridStore: SchedulerGridComponentStore = inject(SchedulerGridComponentStore);
  private readonly plannersSocketSender: PlannersSocketSenderService = inject(PlannersSocketSenderService);
  private readonly authStore: AuthStore = inject(AuthStore);
  private readonly legendStore: SchedulerLegendStore = inject(SchedulerLegendStore);
  private readonly dialog: Dialog = inject(Dialog);

  private readonly _instances: WritableSignal<IInstance[]> = signal([]);

  public readonly instances: Signal<IInstance[]> = this._instances.asReadonly();

  private readonly lastUpdatedInstance: WritableSignal<IInstance> = signal(null);
  private readonly isJustCreated: WritableSignal<boolean> = signal(false);

  public clearEmpties(): void {
    this._instances.update(state => state.filter(el => el?.legendId?.length > 0));
  }

  public create(instance: Omit<IInstance, 'id' | 'zIndex'>): IInstance {
    const newInstance: IInstance = {
      ...instance,
      id: ulid(),
      zIndex: this.instances().length + 1,
    };

    this._instances.update(instances => [ ...instances, newInstance ]);

    this.isJustCreated.set(true)

    return newInstance;
  }

  public initInstances(instances: IInstancePayload[]): void {
    this._instances.set(instances.map(e => this.mapPayloadToInstance(e)))
  }

  public addInstanceFromSocket(instance: IInstancePayload): void {
    this._instances.update(instances => [ ...instances, this.mapPayloadToInstance(instance) ]);
  }

  public update(instanceId: string, position: Partial<IInstancePosition>): void {
    this._instances.update(instances => {
      return instances.map(instance => {
        if (instance.id !== instanceId) return instance;

        const updatedPosition = { ...instance.position, ...position };
        const updatedInstance =  { ...instance, position: updatedPosition }
        this.lastUpdatedInstance.set(updatedInstance);
        return updatedInstance
      });
    });
  }

  public async sendUpdateToSocket(): Promise<void> {
    const instance = this.lastUpdatedInstance();
    if (!instance) return;

    if (this.isJustCreated()) {
      if (!instance.legendId?.length) {
        const legendId = await this.openInstanceLegendIdModal({ instance });

        if (!legendId) {
          this._instances.update(state => state.filter(el => el?.id !== instance.id));
        }

        instance.legendId = legendId;
      }

      const legend = this.legendStore.legendBlocks().find(elem => elem?.id === instance.legendId);

      instance.legendId && this.plannersSocketSender.sendMessage(
        PlannersClientMessages.ADD_INSTANCE,
        { instance: this.mapInstanceToPayload(instance), legend }
      );

      this.isJustCreated.set(false);
      return;
    }

    this.plannersSocketSender.sendMessage(
      PlannersClientMessages.UPDATE_INSTANCE,
      {
        id: instance.id,
        changes: this.mapInstanceToPayload(instance)
      }
    );

    this.clearEmpties();
  }


  private async openInstanceLegendIdModal(data: { instance: IInstance }): Promise<string | undefined> {
    const { SchedulerAddEditBlockModalComponent } = await import(
      '@chronoco/modals/scheduler-add-edit-block-modal/scheduler-add-edit-block-modal.component'
      );

    const dialogRef = this.dialog.open<string>(SchedulerAddEditBlockModalComponent, {
      data,
      providers: [
        {
          provide: SchedulerLegendStore,
          useValue: this.legendStore,
        },
        {
          provide: SchedulerInstancesStore,
          useValue: this,
        },
      ],
    });

    return firstValueFrom(dialogRef.closed);
  }

  public updateInstanceFromSocket( data: { updated: IInstancePayload, userId: string }): void {
    if (data.userId === this.authStore.user().id) return;

    const mapped = this.mapPayloadToInstance(data.updated);

    this._instances.update(instances =>
      instances.map(i => {
        return i.id.trim() === mapped.id.trim() ? mapped : i;
      })
    );
  }

  public delete(id: string): void {
    const legendId = this.instances().find(i => i.id === id).legendId;
    this._instances.update(state => (state.filter(instance => instance.id !== id)));

    this.plannersSocketSender.sendMessage(PlannersClientMessages.REMOVE_INSTANCE, { id });

    if (this.instances().filter(i => i.legendId === legendId)?.length === 0) {
      this.plannersSocketSender.sendMessage(PlannersClientMessages.REMOVE_LEGEND, { id: legendId });
    }
  }

  public deleteBySocket(id: string): void {
    this._instances.update(state => (state.filter(instance => instance.id != id)));
  }

  public deleteBySocketByLegendId(legendId: string): void {
    this._instances.update(state => (state.filter(instance => instance.legendId.trim() !== legendId)));
  }

  public deleteByLegendId(legendId: string): void {
    this._instances.update(state => (state.filter((instance) => instance.legendId !== legendId)));
  }

  public findAtPosition(
    x: number,
    y: number,
  ): IInstance[] {
    return this._instances().filter(instance => {
      const style = this.getPositionStyle(instance.position);
      return (
        x >= style.left &&
        x <= style.left + style.width &&
        y >= style.top &&
        y <= style.top + style.height
      );
    });
  }

  public getPositionStyle(
    position: IInstancePosition,
  ) {
    const gridSizeX = this.gridStore.gridSizeX();
    const gridSizeY = this.gridStore.gridSizeY();

    const top = this.gridStore.dateTimeToIndex(position.startTime) * gridSizeY;
    const height = (this.gridStore.dateTimeToIndex(position.endTime) - this.gridStore.dateTimeToIndex(position.startTime)) * gridSizeY;

    const roomIndexes = position.rooms.map(r => this.gridStore.rooms().findIndex(x => x.name === r));

    const left = Math.min(...roomIndexes) * gridSizeX;

    const width = roomIndexes.length * gridSizeX;

    return { top, height, left, width };
  }

  public updateZIndexes(instanceId: string): void {
    this._instances.update((instances) => {
      const others = instances
        .filter(b => b.id !== instanceId)
        .sort((a, b) => a.zIndex - b.zIndex);

      const zIndexMap = new Map<string, number>(
        others.map((b, i) => [ b.id, i + 1 ]),
      );

      zIndexMap.set(instanceId, instances.length);

      return instances.map(b => ({
        ...b,
        zIndex: zIndexMap.get(b.id)!,
      }));
    });
  }

  private mapPayloadToInstance(payload: IInstancePayload): IInstance {
    return {
      id: payload.id.trim(),
      legendId: payload.legend.id,
      zIndex: payload.zIndex,
      position: {
        rooms: payload.rooms,
        startTime: new Date(payload.startTime),
        endTime: new Date(payload.endTime),
      }
    };
  }

  public mapInstanceToPayload(instance: IInstance): IInstancePayload {
    return {
      id: instance.id,
      legend: { id: instance.legendId },
      zIndex: instance.zIndex,
      rooms: instance.position.rooms,
      startTime: instance.position.startTime,
      endTime: instance.position.endTime
    };
  }
}