import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ILegend } from '@chronoco/models/i-legend';
import { LegendType } from '@chronoco/models/legend-type.enum';
import { ulid } from 'ulid';
import { SchedulerSearchStore } from './scheduler-search.store';
import { PlannersSocketSenderService } from '../services/planners-socket/planners-socket-sender.service';
import { PlannersClientMessages } from '../models/planners-socket-messages';

@Injectable()
export class SchedulerLegendStore {
  private readonly plannersSocketSender: PlannersSocketSenderService = inject(PlannersSocketSenderService);

  private readonly _legendBlocks: WritableSignal<ILegend[]> = signal([]);
  public readonly legendBlocks: Signal<ILegend[]> = this._legendBlocks.asReadonly();

  private readonly _selectedLegendBlock: WritableSignal<ILegend> = signal(null);
  public readonly selectedLegendBlock = this._selectedLegendBlock.asReadonly();

  private readonly searchStore: SchedulerSearchStore = inject(SchedulerSearchStore);

  public readonly filteredLegends: Signal<ILegend[]> = computed(() => {
    const filter = this.searchStore.searchFilter();
    const blocks = this._legendBlocks();

    if (!filter) return blocks;

    const regex = new RegExp(filter, 'i');
    return blocks.filter(({ name }) => regex.test(name));
  });

  public initLegends(legends: ILegend[]) {
    this._legendBlocks.set(legends);
  }

  public addLegendBySocket(legend: ILegend) {
    this._legendBlocks.update(state => ([ ...state, legend ]));
  }

  public createLegendDefinition(name: string, type: LegendType, description: string): ILegend {
    const legend: ILegend = {
      id: ulid(),
      type,
      name,
      description,
    };

    this._legendBlocks.update(state => ([ ...state, legend ]));
    return legend
  }

  public updateLegendDefinition(legendId: string, updated: Partial<Omit<ILegend, 'id'>>): void {
    this.plannersSocketSender.sendMessage(PlannersClientMessages.UPDATE_LEGEND, { id: legendId, changes: updated });
    this._legendBlocks.update(state => state.map(el => el.id === legendId ? { ...el, ...updated } : el));
  }

  public updateLegendDefinitionBySocket(legend: ILegend): void {
    this._legendBlocks.update(state => (state.map(el => el?.id === legend.id ? legend : el)));
  }

  public deleteLegendDefinition(legendId: string): void {
    this.plannersSocketSender.sendMessage(PlannersClientMessages.REMOVE_LEGEND, { id: legendId });
    this._legendBlocks.update(state => state.filter(({ id }) => id !== legendId));
  }
  public removeLegendBySocket(legendId: string): void {
    this._legendBlocks.update(state => state.filter(({ id }) => id !== legendId));
  }

  public selectLegendForDrawing(legendId: string): void {
    const legend = this._legendBlocks().find(l => l.id === legendId);
    this._selectedLegendBlock.set(legend);
  }
}