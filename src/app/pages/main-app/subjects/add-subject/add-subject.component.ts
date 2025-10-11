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

@Component({
  selector: 'app-add-subject',
  imports: [
    SubmitButtonComponent,
    ReactiveFormsModule,
    InputFormComponent,
    SelectFormComponent,
    // AddClassComponent
  ],
  templateUrl: './add-subject.component.html',
  styleUrl: './add-subject.component.scss',
})
export class AddSubjectComponent {
  formData = signal<FormGroup | null>(null);

  years = input<Year[]>([1, 2, 3, 4]);
  semesters = signal<Semester[]>([]);
  departments = signal<Department[]>([]);
  updateItem = input<Subject>();
  classes = signal<Class[]>([]);

  added = output<Subject>();
  updated = output<Subject>();

  private formBuilder = inject(FormBuilder);
  private global = inject(GlobalService);
  private subjectService = inject(SubjectService);
  private departmentService = inject(DepartmentService);

  constructor() {}

  ngOnInit() {
    this.initForm();
    this.getDepartments();
  }

  initForm() {
    const item = this.updateItem();
    const form = this.formBuilder.group({
      name: [item?.name ?? null, Validators.required],
      code: [item?.code ?? null, Validators.required],
      department: [
        item?.classData?.department?._id || null,
        Validators.required,
      ],
      year: [item?.classData?.year || null, Validators.required],
      semester: [
        item?.classData?.semester || null,
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

    this.addSubject();
  }

  async addSubject() {
    try {
      this.global.showSpinner();

      let msg = 'added';
      let data: Subject;

      const dataValue = this.formData()?.value;

      //payload for fetch class id
      const payload = {
        dept_id: dataValue.department,
        year: dataValue.year,
        semester: dataValue.semester,
      };

      //fetch class id
      const classId = await this.fetchClassId(payload);

      // check if update is requested
      if (this.updateItem()) {
        // update item

        msg = 'updated';

        const response = await this.subjectService.updateSubject(
          this.updateItem()!._id,
          {
            name: dataValue.name,
            code: dataValue.code,
            class_id: classId,
          }
        );

        const result = response?.data;
        data = {
          _id: result?.subject?._id,
          name: result?.subject?.name,
          code: result?.subject?.code,
          class_id: result?.subject?.class_id,
          classData: result?.classData,
        };
        //  update records
        this.updated.emit(data);
      } else {
        const response = await this.subjectService.addSubject({
          name: dataValue.name,
          code: dataValue.code,
          class_id: classId,
        });

        const result = response?.data;
        data = {
          _id: result?.subject?._id,
          name: result?.subject?.name,
          code: result?.subject?.code,
          class_id: result?.subject?.class_id,
          classData: result?.classData,
        };
        // update records
        this.added.emit(data);
      }

      this.global.showSuccess(
        `Subject ${msg} successfully`,
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
      const response = await this.departmentService.getDepartments();
      this.setDepartments(response?.Alldata);
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

  async fetchClassId(payload: any) {
    const response = await this.subjectService.fetchClassId(payload);
    return response?.data;
  }
}
