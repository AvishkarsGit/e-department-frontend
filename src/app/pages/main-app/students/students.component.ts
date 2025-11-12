import {
  Component,
  inject,
  input,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  ColumnMode,
  DatatableComponent,
  NgxDatatableModule,
} from '@swimlane/ngx-datatable';
import { ContentHeaderComponent } from '../../../components/content-header/content-header.component';
import { GlobalService } from '../../../services/global/global.service';
import { SearchFilterInputComponent } from '../../../components/search-filter-input/search-filter-input.component';
import { AppConstants } from '../../../constants/app.constants';
import { IconRoundButtonComponent } from '../../../components/buttons/icon-round-button/icon-round-button.component';
import { NgClass } from '@angular/common';
import { Student } from '../../../interfaces/student.interface';
import { StudentService } from '../../../services/student/student.service';
import { ExcelButtonComponent } from '../../../components/buttons/excel-button/excel-button.component';
import { UserProfile } from '../../../interfaces/user-profile.interface';
import { ViewProfileComponent } from '../view-profile/view-profile.component';
import { ProfileService } from '../../../services/profile/profile.service';
import { UserService } from '../../../services/user/user.service';
import { SubmitButtonComponent } from '../../../components/buttons/submit-button/submit-button.component';
import { SelectFormComponent } from '../../../components/forms/select-form/select-form.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Semester, Year } from '../../../interfaces/class.interface';
import { DepartmentService } from '../../../services/department/department.service';
import { Department } from '../../../interfaces/department.interface';
import { SubjectService } from '../../../services/subject/subject.service';

type ItemType = Student;

@Component({
  selector: 'app-students',
  imports: [
    ContentHeaderComponent,
    ReactiveFormsModule,
    NgxDatatableModule,
    SearchFilterInputComponent,
    IconRoundButtonComponent,
    // NgClass,
    ExcelButtonComponent,
    ViewProfileComponent,
    SubmitButtonComponent,
    SelectFormComponent,
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
})
export class StudentsComponent {
  table = viewChild<DatatableComponent>(DatatableComponent);

  ColumnMode = ColumnMode;
  title = 'STUDENTS';

  students = signal<ItemType[]>([]);
  exported_students = signal<ItemType[]>([]);
  loadingIndicator = signal<boolean>(false);
  updateItem = signal<ItemType | null>(null);
  role = signal<string>('student');
  updateProfileItem = signal<UserProfile | null>(null);
  filterForm = signal<FormGroup | null>(null);
  years = input<Year[]>([1, 2, 3, 4]);
  semesters = signal<Semester[]>([]);
  departments = signal<Department[]>([]);

  totalRecords = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(AppConstants.PAGE_SIZE);
  sortField = signal<string>('id');
  sortOrder = signal<string>('asc');
  filterText = signal<string>('');

  // check card for component reusability
  isCard = input<boolean>(false);

  public global = inject(GlobalService);
  private studentService = inject(StudentService);
  private profileService = inject(ProfileService);
  private userService = inject(UserService);
  private departmentService = inject(DepartmentService);
  private subjectService = inject(SubjectService);
  private fb = inject(FormBuilder);

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.loadData();
    this.getDepartments();
  }

  initForm() {
    const item = this.updateItem();
    // this.getDepartments();
    const form = this.fb.group({
      department: [item?.classData?.department_id || null, Validators.required],
      year: [item?.classData?.year || null, Validators.required],
      semester: [
        item?.classData?.semester || null,
        [Validators.required, Validators.minLength(1), Validators.maxLength(2)],
      ],
    });

    this.filterForm.set(form);
  }

  async openAddModal(template: TemplateRef<any>, update: boolean = false) {
    if (!update) this.updateItem.set(null);
    this.global.showModal(template);
  }

  onPageChange(event: any) {
    this.currentPage.set(event.offset);
    this.loadData();
  }

  async applyFilters() {
    if (this.filterForm()?.invalid) {
      console.log('submit');
      this.filterForm()?.markAllAsTouched();
      return;
    }

    const classId = await this.fetchClassId(this.filterForm()?.value);
    this.loadData(classId!);
  }

  onSortChange(event: any) {
    const sort = event.sorts[0];

    if (!sort?.prop) return;

    this.sortField.set(sort.prop);
    this.sortOrder.set(sort.dir);
    this.loadData();
  }

  onFilterChange(event: any) {
    this.filterText.set(event);
    this.loadData();
  }

  editItem(item: ItemType, template: TemplateRef<any>) {
    this.updateItem.set(item);
    this.openAddModal(template, true);
  }

  async onStatusChange(status: boolean, item: ItemType) {
    if (this.profileService.profile()?.role === item?.user?.role) {
      this.global.showAlert(
        'Error',
        'You can not accept/reject your status',
        'Ok'
      );
      return;
    }
    //change status
    let message = status === true ? 'accept' : 'reject';
    const result = await this.global.showAlert(
      'Are you sure?',
      `You want to ${message} this faculty!`,
      'YES',
      false,
      'NO',
      'question'
    );
    if (result.isConfirmed && status === true) {
      this.changeStatus(status, item);
    } else {
      return;
    }
  }
  async changeStatus(status: boolean, item: ItemType) {
    try {
      this.global.showSpinner();
      const data = {
        id: item?.user?._id,
        status,
      };
      await this.userService.changeStatus(data);

      this.global.showSuccess(
        'User accepted successfully...',
        null,
        5000,
        false,
        'increasing',
        'toast-top-center'
      );

      //load latest
      this.updateData();
    } catch (err) {
      this.global.showAlert('Error!', err, 'OK');
    } finally {
      this.global.hideSpinner();
    }
  }

  async deleteItemAlert(item: ItemType) {
    const result = await this.global.showAlert(
      'Are you sure?',
      'You want to delete this student!',
      'YES',
      false,
      'NO',
      'question'
    );
    if (result.isConfirmed) {
      this.deleteItem(item);
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === this.global.cancelSwal()
    ) {
      // enter any functionality here
    }
  }

  async loadData(classId?: string) {
    this.setLoadingIndicator(true);

    try {
      const params: any = {
        page: this.currentPage() + 1,
        size: this.pageSize(),
        sortField: this.sortField(),
        sortOrder: this.sortOrder(),
        filter: this.filterText(),
      };

      if (classId) {
        params.classId = classId;
      }

      this.global.showSpinner();

      const response = await this.studentService.getStudents(params);

      this.setStudents(response?.data);
      //prepare an array of object for exporting student which are showing only on the table
      const students_export = response?.data.map((s: any) => ({
        name: s.user.name,
        email: s.user.email,
        phone: s.user.phone,
        photo: s.user.photo,
        rollNo: s.rollNo,
        year: s.classData.year,
        semester: s.classData.semester,
      }));
      this.exported_students.set(students_export);
      this.totalRecords.set(response?.pagination?.total);
    } catch (e) {
      console.log(e);
      this.global.showErrorMessage(
        e,
        null,
        3000,
        false,
        'decreasing',
        'toast-top-center'
      );
    } finally {
      this.setLoadingIndicator(false);
      this.global.hideSpinner();
    }
  }

  addData(student: ItemType) {
    this.students.update((students) => [...students, student]);
    this.updateTotalRecords(1);
  }

  updateData() {
    // this.students.update((students) =>
    //   students.map((student) =>
    //     student._id === updatedStudent._id ? updatedStudent : student
    //   )
    // );
    this.loadData();
  }

  setLoadingIndicator(value: boolean) {
    this.loadingIndicator.set(value);
  }

  updateTotalRecords(num: number) {
    this.totalRecords.update((total) => total + num);
  }
  setStudents(data: ItemType[]) {
    this.students.set(data);
  }

  async deleteItem(item: ItemType) {
    try {
      this.global.showSpinner();

      console.log('item', item);
      const data = await this.studentService.deleteStudent(
        item!._id,
        item!.user_id
      );

      console.log(data);
      // update table
      this.deleteData(item?._id!);

      this.global.showSuccess(
        'Student deleted successfully',
        null,
        5000,
        false,
        'increasing',
        'toast-top-center'
      );

      this.global.hideSpinner();
    } catch (e) {
      console.log(e);
      // this.global.hideSpinner();
      this.global.showAlert('Error!', e, 'OK');
    } finally {
      this.global.hideSpinner();
    }
  }

  deleteData(userId: string) {
    this.students.update((users) =>
      users.filter((user) => user._id !== userId)
    );
    this.updateTotalRecords(-1);
  }

  viewProfile(item: ItemType, template: TemplateRef<any>) {
    //prepare userProfile data
    this.prepareData(item);
    this.global.showModal(template);
  }

  prepareData(item: ItemType) {
    const data: UserProfile = {
      _id: item?._id,
      name: item?.user?.name,
      email: item?.user?.email,
      phone: item?.user?.phone,
      photo: item?.user?.photo!,
      username: item?.user?.username,
      role: item?.user?.role,
      rollNo: item?.rollNo,
      semester: item?.classData?.semester,
      year: item?.classData?.year,
      department: item?.classData?.department?.name!,
      emailVerified: item?.user?.email_verified,
      guardians: item?.guardian,
      createdAt: item?.user?.created_at!,
    };

    this.updateProfileItem.set(data);
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

  async fetchClassId(formData: any) {
    console.log('formData:', formData);
    const payload = {
      dept_id: formData.department,
      year: formData.year,
      semester: formData.semester,
    };
    const response = await this.subjectService.fetchClassId(payload);
    return response?.data;
  }
}
