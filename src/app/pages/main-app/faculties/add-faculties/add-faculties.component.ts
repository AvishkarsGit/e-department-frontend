import { Component, effect, inject, input, output, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { SubmitButtonComponent } from '../../../../components/buttons/submit-button/submit-button.component';
import { InputFormComponent } from '../../../../components/forms/input-form/input-form.component';
import { GlobalService } from '../../../../services/global/global.service';
import { FileInputComponent } from '../../../../components/forms/file-input/file-input.component';
import { SelectFormComponent } from '../../../../components/forms/select-form/select-form.component';
import { Semester, Year } from '../../../../interfaces/class.interface';
import { Department } from '../../../../interfaces/department.interface';
import { DepartmentService } from '../../../../services/department/department.service';
import { Student } from '../../../../interfaces/student.interface';
import { Guardian } from '../../../../interfaces/guardian.interface';
import { StudentService } from '../../../../services/student/student.service';
import { SubjectService } from '../../../../services/subject/subject.service';
import { Faculty } from '../../../../interfaces/faculty.interface';
import { FacultyService } from '../../../../services/faculty/faculty.service';

@Component({
  selector: 'app-add-faculties',
  imports: [
    ReactiveFormsModule,
    SubmitButtonComponent,
    InputFormComponent,
    FileInputComponent,
    SelectFormComponent,
  ],
  templateUrl: './add-faculties.component.html',
  styleUrl: './add-faculties.component.scss'
})
export class AddFacultiesComponent {
  formData = signal<FormGroup | null>(null);
  isSignup = input<boolean>(false);
  register = output<Faculty>();
  updateItem = input<Faculty>();

  years = input<Year[]>([1, 2, 3, 4]);
  semesters = signal<Semester[]>([]);
  departments = signal<Department[]>([]);
  added = output<Faculty>();
  updated = output<Faculty>();

  private formBuilder = inject(FormBuilder);
  private global = inject(GlobalService);
  private departmentService = inject(DepartmentService);
  private facultyService = inject(FacultyService);



  constructor() { }

  ngOnInit() {
    this.initForm();
    this.loadDepartments();
  }

  initForm() {
    const item = this.updateItem();
    const form = this.formBuilder.group({
      name: [item?.user?.name || null, Validators.required],
      username: [item?.user?.username || null, Validators.required],
      email: [
        item?.user?.email || null,
        [Validators.required, Validators.email],
      ],
      phone: [
        item?.user?.phone || null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],

      password: [
        null,
        [
          Validators.minLength(8),
          this.updateItem() ? null : Validators.required,
        ].filter(Boolean),
      ],
      photo: [item?.user?.photo ?? null],

      department: [item?.department_id || null, Validators.required],
    });

    this.formData.set(form);
  }

  onSubmit() {
    if (this.formData()?.invalid) {
      console.log('submit');
      this.formData()?.markAllAsTouched();
      return;
    }

    if (this.isSignup()) {
      this.register.emit(this.formData()?.value);
      return;
    }

    this.addStudent();
  }

  async loadDepartments() {
    try {
      const response = await this.departmentService.getDepartments();
      this.departments.set(response?.Alldata || []);
    } catch (err) {
      console.error(err);
    }
  }

  setDepartments(data: Department[]) {
    this.departments.set(data);
  }

  async addStudent() {
    try {
      this.global.showSpinner();

      let msg = 'added';
      let data: Faculty;

      const formDataValue = this.formData()?.value;

      const payload = {
        name: formDataValue.name,
        email: formDataValue.email,
        username: formDataValue.username,
        password: formDataValue.password,
        phone: formDataValue.phone,
        department_id: formDataValue.department,
        photo: formDataValue.photo,
      };
      console.log("payload", payload);

      // // check if update is requested
      if (this.updateItem()) {
        // update item

        msg = 'updated';

        data = await this.facultyService.updateFaculty(
          this.updateItem()!._id,
          this.updateItem()!.user_id,
          payload
        );
        //update records
        this.updated.emit(data);
      } else {
        data = await this.facultyService.addFaculty(payload);
        //  // update records
        this.added.emit(data);
      }

      this.global.showSuccess(
        `Faculty ${msg} successfully`,
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
