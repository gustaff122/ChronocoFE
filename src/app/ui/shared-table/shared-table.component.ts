import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, computed, DestroyRef, inject, Injector, input, InputSignal, OnInit, output, OutputEmitterRef, Signal, signal, TemplateRef, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ITableCheckboxes } from './models/i-table-checkboxes';
import { ITableColumn } from './models/i-table-column';
import { ITableConfig } from './models/i-table-config';
import { ITableDatasource } from './models/i-table-datasource';
import { TableGetCellTemplatePipe } from './pipes/table-get-cell-template.pipe';

@Component({
  selector: 'app-shared-table',
  imports: [
    NgTemplateOutlet,
    TableGetCellTemplatePipe,
    FormsModule,
    NgClass,
  ],
  templateUrl: './shared-table.component.html',
  styleUrl: './shared-table.component.scss',
})
export class SharedTableComponent implements OnInit {
  public datasource: InputSignal<ITableDatasource<any[]>> = input(null);
  public config: InputSignal<ITableConfig> = input(null);
  public templates: InputSignal<TemplateRef<any>[]> = input([]);
  public isLoading: InputSignal<boolean> = input(false);
  public isInitialLoading: Signal<boolean> = computed(() => this.datasource().items.length === 0 && this.isLoading());
  public isLoadingAnotherPage: Signal<boolean> = computed(() => this.datasource().items.length > 0 && this.isLoading());
  public emptyColspan: Signal<number> = computed(() =>
    this.config().checkboxesConfig?.hasCheckboxes ? this.config().columns.length + 1 : this.config().columns.length,
  );

  public templatesNames: Signal<string[]> = computed(() => this.templates().map(template => (template as any)?._declarationTContainer.localNames[0]));

  public displayedColumns: WritableSignal<ITableColumn[]> = signal([]);
  public displayedRows: WritableSignal<any[]> = signal([]);

  public readonly onCheckboxesChange: OutputEmitterRef<ITableCheckboxes> = output<{
    [key: string]: boolean;
  }>();

  private readonly injector: Injector = inject(Injector);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public checkboxesArray: WritableSignal<ITableCheckboxes> = signal({});
  public headerCheckbox: WritableSignal<boolean> = signal(false);

  public ngOnInit(): void {
    this.displayedColumns.set(this.config().columns);
    this.initDatasourceChangeListener();
    console.log(this.templates());
  }

  public initDatasourceChangeListener(): void {
    toObservable(this.datasource, { injector: this.injector })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ items }) => {
        let checkboxes: ITableCheckboxes = {};
        items.forEach(el => {
          checkboxes = { ...checkboxes, [el[this.config()?.checkboxesConfig?.checkboxKey]]: false };
        });

        this.displayedRows.set(items);
        this.checkboxesArray.set(checkboxes);
        this.headerCheckbox.set(false);
      });
  }

  public onHeaderCheckboxChange(isSelected: boolean): void {
    this.headerCheckbox.set(isSelected);

    this.checkboxesArray.update(state => {
      return Object.fromEntries(Object.keys(state).map(key => [ key, isSelected ]));
    });

    this.onCheckboxesChange.emit(this.checkboxesArray());
  }

  public onCheckboxChange(isSelected: boolean, key: string): void {
    this.checkboxesArray.update(state => {
      return {
        ...state,
        [key]: isSelected,
      };
    });

    const areAllSelected: boolean = Object.values(this.checkboxesArray()).every(value => value === true);
    this.headerCheckbox.set(areAllSelected);

    this.onCheckboxesChange.emit(this.checkboxesArray());
  }
}
