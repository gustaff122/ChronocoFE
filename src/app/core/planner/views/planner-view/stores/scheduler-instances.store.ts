import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { IInstance, IInstancePayload, IInstancePosition } from '@chronoco/models/i-legend';
import { ulid } from 'ulid';
import { SchedulerGridComponentStore } from '../components/scheduler-grid/scheduler-grid.component.store';
import { PlannersClientMessages } from '../models/planners-socket-messages';
import { PlannersSocketSenderService } from '../services/planners-socket/planners-socket-sender.service';
import { AuthStore } from '@chronoco/stores/auth-store/auth.store';

@Injectable()
export class SchedulerInstancesStore {
  private readonly gridStore: SchedulerGridComponentStore = inject(SchedulerGridComponentStore);
  private readonly plannersSocketSender: PlannersSocketSenderService = inject(PlannersSocketSenderService);
  private readonly authStore: AuthStore = inject(AuthStore);

  private readonly _instances: WritableSignal<IInstance[]> = signal([]);

  public readonly instances: Signal<IInstance[]> = this._instances.asReadonly();

  private readonly lastUpdatedInstance: WritableSignal<IInstance> = signal(null);
  private readonly isJustCreated: WritableSignal<boolean> = signal(false);

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

  public sendUpdateToSocket(): void {
    if (this.isJustCreated()) {
      this.plannersSocketSender.sendMessage(PlannersClientMessages.ADD_INSTANCE, {instance: this.mapInstanceToPayload(this.lastUpdatedInstance())});
      this.isJustCreated.set(false);
    } else {
      this.plannersSocketSender.sendMessage(PlannersClientMessages.UPDATE_INSTANCE,
        { id: this.lastUpdatedInstance().id, changes: this.mapInstanceToPayload(this.lastUpdatedInstance()) }
      );
    }
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
    this._instances.update(state => (state.filter(instance => instance.id !== id)));
    this.plannersSocketSender.sendMessage(PlannersClientMessages.REMOVE_INSTANCE, { id });
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