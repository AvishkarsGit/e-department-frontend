import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
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

@Component({
  selector: 'app-add-student',
  imports: [
    ReactiveFormsModule,
    SubmitButtonComponent,
    InputFormComponent,
    FileInputComponent,
    SelectFormComponent,
  ],
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.scss',
})
export class AddStudentComponent {
  formData = signal<FormGroup | null>(null);
  isSignup = input<boolean>(false);
  register = output<Student>();
  updateItem = input<Student>();

  years = input<Year[]>([1, 2, 3, 4]);
  semesters = signal<Semester[]>([]);
  departments = signal<Department[]>([]);
  added = output<Student>();
  updated = output<Student>();

  private formBuilder = inject(FormBuilder);
  private global = inject(GlobalService);
  private departmentService = inject(DepartmentService);
  private studentService = inject(StudentService);
  private subjectService = inject(SubjectService);

  constructor() {}

  ngOnInit() {
    this.initForm();
    this.loadDepartments();
  }

  atLeastOneGuardian(control: AbstractControl): ValidationErrors | null {
    const formArray = control as FormArray;
    return formArray && formArray.length > 0 ? null : { noGuardian: true };
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

      rollNo: [item?.rollNo ?? null],

      // 👇 guardian FormArray
      guardian: this.formBuilder.array(
        item?.guardian?.map((g) => this.createGuardianForm(g)) || [],
        { validators: [this.atLeastOneGuardian] }
      ),

      department: [item?.classData?.department_id || null, Validators.required],

      year: [item?.classData?.year || null, Validators.required],

      semester: [
        item?.classData?.semester || null,
        [Validators.required, Validators.minLength(1), Validators.maxLength(2)],
      ],
    });

    this.formData.set(form);
  }

  // helper function for guardian form
  createGuardianForm(guardian?: Guardian): FormGroup {
    return this.formBuilder.group({
      name: [guardian?.name || null, Validators.required],
      relation: [guardian?.relation || null, Validators.required],
      phone: [
        guardian?.phone || null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
    });
  }

  get guardianArray(): FormArray {
    return this.formData()?.get('guardian') as FormArray;
  }

  addGuardian() {
    this.guardianArray.push(this.createGuardianForm());
  }

  removeGuardian(index: number) {
    this.guardianArray.removeAt(index);
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
      this.semesters.set([1, 2]);
    } catch (err) {
      console.error(err);
    }
  }

  setDepartments(data: Department[]) {
    this.departments.set(data);
  }

  setSemester(data: Semester[]) {
    this.semesters.set(data);
  }
  async addStudent() {
    try {
      this.global.showSpinner();

      let msg = 'added';
      let data: Student;

      //fetch classId
      const class_id = await this.fetchClassId({
        dept_id: this.formData()?.value.department,
        year: this.formData()?.value.year,
        semester: this.formData()?.value.semester,
      });

      const formDataValue = this.formData()?.value;

      const payload = {
        name: formDataValue.name,
        email: formDataValue.email,
        username: formDataValue.username,
        password: formDataValue.password,
        phone: formDataValue.phone,
        class_id: class_id,
        photo: formDataValue.photo,
        rollNo:parseInt(formDataValue.rollNo),
        guardian: JSON.stringify(formDataValue.guardian),
      };


      // check if update is requested
      if (this.updateItem()) {
        // update item

        msg = 'updated';

        data = await this.studentService.updateStudent(
          this.updateItem()!._id,
          this.updateItem()!.user_id,
          payload
        );
        //update records
        this.updated.emit(data);
      } else {
        data = await this.studentService.addStudent(payload);
        //  // update records
        this.added.emit(data);
      }
      //  console.log(data);

      this.global.showSuccess(
        `Student ${msg} successfully`,
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

  async fetchClassId(payload: any) {
    const response = await this.subjectService.fetchClassId(payload);
    return response?.data;
  }
}
