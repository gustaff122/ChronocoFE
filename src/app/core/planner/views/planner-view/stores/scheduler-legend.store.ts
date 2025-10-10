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


  public createLegendDefinition(name: string, type: LegendType, description: string): void {
    const legend: ILegend = {
      id: ulid(),
      type,
      name,
      description,
    };

    this.plannersSocketSender.sendMessage(PlannersClientMessages.ADD_LEGEND, { legend });
    this._legendBlocks.update(state => ([ ...state, legend ]));
  }

  public updateLegendDefinition(legendId: string, updates: Partial<Omit<ILegend, 'id'>>): void {
    this._legendBlocks.update(state => state.map(el => el.id === legendId ? { ...el, ...updates } : el));
  }

  public deleteLegendDefinition(legendId: string): void {
    this._legendBlocks.update(state => state.filter(({ id }) => id !== legendId));
  }

  public selectLegendForDrawing(legendId: string): void {
    const legend = this._legendBlocks().find(l => l.id === legendId);
    this._selectedLegendBlock.set(legend);
  }
}