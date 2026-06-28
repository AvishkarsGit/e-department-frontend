import { Component, inject, input, output, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SubmitButtonComponent } from '../../../../components/buttons/submit-button/submit-button.component';
import { InputFormComponent } from '../../../../components/forms/input-form/input-form.component';
import { GlobalService } from '../../../../services/global/global.service';
import { UserService } from '../../../../services/user/user.service';
import { Role, User } from '../../../../interfaces/user.interface';
//import { SelectFormComponent } from '../../../../components/forms/select-form/select-form.component';
import { ToggleFormButtonComponent } from '../../../../components/forms/toggle-form-button/toggle-form-button.component';
import { FileInputComponent } from '../../../../components/forms/file-input/file-input.component';
import { SelectFormComponent } from '../../../../components/forms/select-form/select-form.component';
import { Class, Semester, Year } from '../../../../interfaces/class.interface';
import { Department } from '../../../../interfaces/department.interface';
import { DepartmentService } from '../../../../services/department/department.service';
import { ClassService } from '../../../../services/class/class.service';

@Component({
  selector: 'app-add-class',
  imports: [
    ReactiveFormsModule,
    SubmitButtonComponent,
    // InputFormComponent,
    //SelectFormComponent,
    // ToggleFormButtonComponent,
    // FileInputComponent,
    SelectFormComponent,
  ],
  templateUrl: './add-class.component.html',
  styleUrl: './add-class.component.scss',
})
export class AddClassComponent {
  formData = signal<FormGroup | null>(null);
  years = input<Year[]>([1, 2, 3, 4]);
  semesters = signal<Semester[]>([]);
  departments = signal<Department[]>([]);
  updateItem = input<Class>();

  added = output<Class>();
  updated = output<Class>();

  private formBuilder = inject(FormBuilder);
  private global = inject(GlobalService);
  private departmentService = inject(DepartmentService);
  private classService = inject(ClassService);

  constructor() {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const item = this.updateItem();
    this.getDepartments();
    const form = this.formBuilder.group({
      department: [item?.department_id || null, Validators.required],
      year: [item?.year || null, Validators.required],
      semester: [
        item?.semester || null,
        [Validators.required, Validators.minLength(1), Validators.maxLength(2)],
      ],
    });

    this.formData.set(form);
  }

  onSubmit() {
    if (this.formData()?.invalid) {
      console.log('submit');
      this.formData()?.markAllAsTouched();
      return;
    }

    const data: Class = {
      department_id: this.formData()?.value.department,
      year: this.formData()?.value.year,
      semester: this.formData()?.value.semester,
    };

    this.addClass(data);
  }

  async addClass(classData: Class) {
    try {
      this.global.showSpinner();

      let msg = 'added';
      let data: Class;

      // check if update is requested
      if (this.updateItem()) {
        // update item

        msg = 'updated';

        data = await this.classService.updateClass(
          this.updateItem()?._id!,
          classData
        );
        //update records
        
        this.updated.emit(data);
      } else {
        data = await this.classService.addClass(classData);
        // update records
        this.added.emit(data);
      }

      this.global.showSuccess(
        `Class ${msg} successfully`,
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

  async getDepartments() {
    try {
      const response = await this.departmentService.getAllDepartments();
      console.log('response ', response);
      this.setDepartments(response?.data);
      //set semester data
      this.setSemester([1, 2]);
    } catch (error) {
      throw error;
    }
  }

  setDepartments(data: Department[]) {
    this.departments.set(data);
  }

  setSemester(data: Semester[]) {
    this.semesters.set(data);
  }
}
