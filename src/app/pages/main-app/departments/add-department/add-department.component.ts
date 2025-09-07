import { Component, inject, input, output, signal } from '@angular/core';
import {FormBuilder,FormGroup,ReactiveFormsModule,Validators,} from '@angular/forms';
import { GlobalService } from '../../../../services/global/global.service';
import { SubmitButtonComponent } from '../../../../components/buttons/submit-button/submit-button.component';
import { InputFormComponent } from '../../../../components/forms/input-form/input-form.component';
import { Department } from '../../../../interfaces/department.interface';
import { DepartmentService } from '../../../../services/department/department.service';


@Component({
  selector: 'app-add-department',
  imports: [
    SubmitButtonComponent,
    ReactiveFormsModule,
    InputFormComponent,
  ],
  templateUrl: './add-department.component.html',
  styleUrl: './add-department.component.scss'
})
export class AddDepartmentComponent {
  formData = signal<FormGroup | null>(null);

  updateItem = input<Department>();

  added = output<Department>();
  updated = output<Department>();

  private formBuilder = inject(FormBuilder);
  private global = inject(GlobalService);
  private departmentService = inject(DepartmentService);

  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const item = this.updateItem();
    const form = this.formBuilder.group({
      name: [item?.name ?? null, Validators.required],

    });

    this.formData.set(form);
  }

  onSubmit() {
    if (this.formData()?.invalid) {
      console.log('submit');
      this.formData()?.markAllAsTouched();
      return;
    }

    console.log(this.formData()?.value);
    this.addDepartment();
  }

  async addDepartment() {
    try {
      this.global.showSpinner();

      let msg = 'added';
      let data: Department;

      const dataValue = this.formData()?.value;

      // check if update is requested
      if (this.updateItem()) {
        // update item

        msg = 'updated';
        data = await this.departmentService.updateDepartment(
          this.updateItem()?._id!,
          dataValue
        );

        // update records
        this.updated.emit(data);
      } else {
        data = await this.departmentService.addDepartment(dataValue);
        // update records
        this.added.emit(data);
      }
      // console.log(data);

      this.global.showSuccess(
       `Department ${msg} successfully`,
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
