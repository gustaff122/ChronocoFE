import { Component, computed, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LegendType } from '@chronoco/models/legend-type.enum';
import { SchedulerTranslateBlockTypePipe } from '../../pipes/scheduler-translate-block-type.pipe';
import { ModalComponent } from '../../ui/modal/modal.component';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ButtonComponent } from '@chronoco/ui/button/button.component';
import { SelectInputComponent } from '@chronoco/ui/select-input/select-input.component';
import { InputComponent } from '@chronoco/ui/input/input.component';
import { TextareaComponent } from '@chronoco/ui/textarea/textarea.component';
import { IInstance, ILegend } from '@chronoco/models/i-legend';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { SchedulerLegendStore } from '@chronoco/core/planner/views/planner-view/stores/scheduler-legend.store';
import { SchedulerInstancesStore } from '@chronoco/core/planner/views/planner-view/stores/scheduler-instances.store';
import { ISelectOption } from '@chronoco/models/i-select-option';

interface IAddLegendForm {
  name: FormControl<string>;
  type: FormControl<LegendType>;
  description: FormControl<string>;
}

@Component({
  selector: 'app-scheduler-add-edit-block-modal',
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    ButtonComponent,
    SelectInputComponent,
    InputComponent,
    TextareaComponent,
    CdkConnectedOverlay,
    CdkOverlayOrigin,
  ],
  templateUrl: './scheduler-add-edit-block-modal.component.html',
  styleUrl: './scheduler-add-edit-block-modal.component.css',
  providers: [
    SchedulerTranslateBlockTypePipe,
  ],
})
export class SchedulerAddEditBlockModalComponent implements OnInit {
  public editedData: { legend: ILegend, instance: IInstance } = inject(DIALOG_DATA);

  private readonly legendStore: SchedulerLegendStore = inject(SchedulerLegendStore);
  private readonly instancesStore: SchedulerInstancesStore = inject(SchedulerInstancesStore);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly dialogRef: DialogRef = inject(DialogRef);
  private readonly schedulerTranslateBlockTypePipe: SchedulerTranslateBlockTypePipe = inject(SchedulerTranslateBlockTypePipe);

  public readonly blockTypes: Signal<LegendType[]> = computed(() => Object.values(LegendType));
  public readonly blockTypesOptions: Signal<ISelectOption[]> = computed(() => Object.values(LegendType).map((el) => ({ display: this.schedulerTranslateBlockTypePipe.transform(el), value: el })));

  public readonly isDeleteOverlayOpen: WritableSignal<boolean> = signal(false);

  public form: FormGroup<IAddLegendForm>;

  public ngOnInit(): void {
    this.buildForm();
  }

  public submitHandler(): void {
    if (this.form.invalid) {
      return
    }

    if (this.editedData?.legend?.name) {
      this.editLegendHandler();
      this.dialogRef.close();
    } else {
      const legendId = this.addLegendHandler();
      this.dialogRef.close(legendId);
    }
  }

  private addLegendHandler(): string {
    const { name, type, description } = this.form.getRawValue();
    const { id } = this.legendStore.createLegendDefinition(name, type, description);
    return id
  }

  private editLegendHandler(): void {
    this.legendStore.updateLegendDefinition(this.editedData?.legend.id, this.form.getRawValue());
  }

  public openDeleteOverlay(): void {
    this.isDeleteOverlayOpen.set(true);
  }

  public closeDeleteOverlay(): void {
    this.isDeleteOverlayOpen.set(false);
  }

  public deleteLegendHandler(): void {
    this.legendStore.deleteLegendDefinition(this.editedData?.legend?.id);
    this.instancesStore.deleteByLegendId(this.editedData?.legend?.id);
    this.instancesStore.clearEmpties();
    this.dialogRef.close();
  }

  private buildForm(): void {
    const blockTypeValue = this.editedData?.legend?.type || this.blockTypes()[0];

    this.form = this.formBuilder.group<IAddLegendForm>({
      name: new FormControl(this.editedData?.legend?.name, [ Validators.required ]),
      type: new FormControl(blockTypeValue, [ Validators.required ]),
      description: new FormControl(this.editedData?.legend?.description),
    });
  }
}
