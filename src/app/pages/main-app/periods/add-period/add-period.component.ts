import { Component, inject, input, output, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GlobalService } from '../../../../services/global/global.service';
import { SubmitButtonComponent } from '../../../../components/buttons/submit-button/submit-button.component';
import { InputFormComponent } from '../../../../components/forms/input-form/input-form.component';
import { Subject } from '../../../../interfaces/subject.interface';
import { SubjectService } from '../../../../services/subject/subject.service';
import { SelectFormComponent } from '../../../../components/forms/select-form/select-form.component';
import { Class, Semester, Year } from '../../../../interfaces/class.interface';
import { Department } from '../../../../interfaces/department.interface';
import { DepartmentService } from '../../../../services/department/department.service';
import { MatDatepickerFormComponent } from '../../../../components/forms/mat-datepicker-form/mat-datepicker-form.component';
import { Period } from '../../../../interfaces/period.interface';
import { PeriodService } from '../../../../services/periods/period.service';

@Component({
  selector: 'app-add-period',
  imports: [SubmitButtonComponent, ReactiveFormsModule, InputFormComponent],
  templateUrl: './add-period.component.html',
  styleUrl: './add-period.component.scss',
})
export class AddPeriodComponent {
  formData = signal<FormGroup | null>(null);

  updateItem = input<Period>();
  classes = signal<Class[]>([]);

  added = output<Period>();
  updated = output<Period>();

  private formBuilder = inject(FormBuilder);
  private global = inject(GlobalService);
  private periodService = inject(PeriodService);

  constructor() {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const item = this.updateItem();
    const form = this.formBuilder.group({
      period_text: [item?.period_text ?? null, Validators.required],
      period: [item?.period ?? null, Validators.required],
      start_time: [item?.start_time ?? null, Validators.required],
      ending_time: [item?.ending_time ?? null, Validators.required],
    });

    this.formData.set(form);
  }

  onSubmit() {
    if (this.formData()?.invalid) {
      console.log('submit');
      this.formData()?.markAllAsTouched();
      return;
    }

    this.addPeriod();
  }

  async addPeriod() {
    try {
      this.global.showSpinner();

      let msg = 'added';
      let data: Period;

      const dataValue = this.formData()?.value;

      // check if update is requested
      if (this.updateItem()) {
        // update item

        msg = 'updated';

        const response = await this.periodService.updatePeriod(
          dataValue,
          this.updateItem()?._id!
        );
        data = response?.data;
        //  update records
        this.updated.emit(data);
      } else {
        const response = await this.periodService.addPeriod(dataValue);
        // update records
        data = response?.data;
        this.added.emit(data);
      }

      this.global.showSuccess(
        `Period ${msg} successfully`,
        null,
        5000,
        false,
        'increasing',
        'toast-top-center'
      );

      this.global.hideModal();
    } catch (e) {
      console.log(e);
      this.global.showAlert('Error!', e, 'OK');
    } finally {
      this.global.hideSpinner();
    }
  }
}
