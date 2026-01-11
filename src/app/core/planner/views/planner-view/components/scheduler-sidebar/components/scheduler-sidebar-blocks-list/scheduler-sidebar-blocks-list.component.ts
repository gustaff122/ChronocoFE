import { Component, computed, inject, input, InputSignal, signal, Signal, WritableSignal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroChevronDown, heroChevronUp, heroPencilSquare } from '@ng-icons/heroicons/outline';
import { SchedulerBlockTypeColorIntensePipe } from '@chronoco/pipes/scheduler-block-type-color.pipe';
import { SchedulerTranslateBlockTypePipe } from '@chronoco/pipes/scheduler-translate-block-type.pipe';
import { LegendType } from '@chronoco/models/legend-type.enum';
import { ILegend } from '@chronoco/models/i-legend';
import { SchedulerLegendStore } from '../../../../stores/scheduler-legend.store';
import { SchedulerInstancesStore } from '../../../../stores/scheduler-instances.store';
import { Dialog } from '@angular/cdk/dialog';
import { TippyDirective } from '@ngneat/helipopper';

@Component({
  selector: 'app-scheduler-sidebar-blocks-list',
  imports: [
    SchedulerTranslateBlockTypePipe,
    NgIcon,
    SchedulerBlockTypeColorIntensePipe,
    TippyDirective,
  ],
  templateUrl: './scheduler-sidebar-blocks-list.component.html',
  styleUrl: './scheduler-sidebar-blocks-list.component.css',
  viewProviders: [
    provideIcons({ heroChevronUp, heroChevronDown, heroPencilSquare }),
  ],
})
export class SchedulerSidebarBlocksListComponent {
  public blocksType: InputSignal<LegendType> = input.required();

  private readonly legendStore: SchedulerLegendStore = inject(SchedulerLegendStore);
  private readonly instancesStore: SchedulerInstancesStore = inject(SchedulerInstancesStore);
  private readonly dialog: Dialog = inject(Dialog);

  public readonly legends: Signal<ILegend[]> = computed(() => this.legendStore.filteredLegends().filter(({ type }) => type === this.blocksType()));

  public readonly selectedLegendBlock: Signal<ILegend> = this.legendStore.selectedLegendBlock;

  public readonly isRolledUp: WritableSignal<boolean> = signal(false);

  public roll(): void {
    this.isRolledUp.update(state => !state);
  }

  public selectItemHandler(id: string): void {
    this.legendStore.selectLegendForDrawing(id);
  }

  public openEditLegendModalHandler(data: ILegend): void {
    import('@chronoco/modals/scheduler-add-edit-block-modal/scheduler-add-edit-block-modal.component').then(({ SchedulerAddEditBlockModalComponent }) => {
      this.dialog.open(SchedulerAddEditBlockModalComponent, {
        data,
        providers: [
          {
            provide: SchedulerLegendStore,
            useValue: this.legendStore,
          },
          {
            provide: SchedulerInstancesStore,
            useValue: this.instancesStore,
          },
        ],
      });
    });
  }
}
