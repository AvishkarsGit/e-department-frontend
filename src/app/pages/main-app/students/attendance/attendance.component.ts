import {
  Component,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ContentHeaderComponent } from '../../../../components/content-header/content-header.component';
import { SubmitButtonComponent } from '../../../../components/buttons/submit-button/submit-button.component';
import { MediumBoxComponent } from '../../../../components/boxes/medium-box/medium-box.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ColumnMode,
  DatatableComponent,
  NgxDatatableModule,
} from '@swimlane/ngx-datatable';
import { SelectFormComponent } from '../../../../components/forms/select-form/select-form.component';
import { MatDatepickerFormComponent } from '../../../../components/forms/mat-datepicker-form/mat-datepicker-form.component';
import { Student } from '../../../../interfaces/student.interface';
import { GlobalService } from '../../../../services/global/global.service';
import { UserService } from '../../../../services/user/user.service';
import { AttendanceService } from '../../../../services/attendance/attendance.service';
import { AttendanceReportService } from '../../../../services/attendance-report/attendance-report.service';
import { StudentService } from '../../../../services/student/student.service';
import { ProfileService } from '../../../../services/profile/profile.service';
import { AppConstants } from '../../../../constants/app.constants';
import { ClassSession } from '../../../../interfaces/class-session.interface';
import { StudentRecord } from '../../../../interfaces/student-record.interface';
import { Subject } from '../../../../interfaces/subject.interface';
import { Class } from '../../../../interfaces/class.interface';
import { DatePipe } from '@angular/common';

type ItemType = Student;
@Component({
  selector: 'app-attendance',
  imports: [
    ContentHeaderComponent,
    ReactiveFormsModule,
    SubmitButtonComponent,
    NgxDatatableModule,
    SelectFormComponent,
    MatDatepickerFormComponent,
    DatePipe,
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
})
export class AttendanceComponent {
  table = viewChild<DatatableComponent>(DatatableComponent);
  ColumnMode = ColumnMode;
  title = 'ATTENDANCE';

  managers = signal<ItemType[]>([]);
  loadingIndicator = signal<boolean>(false);
  updateItem = signal<ClassSession | null>(null);
  updateRecordItem = signal<StudentRecord | null>(null);
  filterForm = signal<FormGroup | null>(null);
  isAllSubjects = signal<boolean>(false);

  totalRecords = signal<number>(0);
  currentPage = signal<number>(1);
  totalPages = signal<number>(0); // New signal for total pages
  pageSize = signal<number>(AppConstants.PAGE_SIZE);
  sortField = signal<string>('created_at');
  sortOrder = signal<string>('desc');
  filterText = signal<string>('');

  students = signal<Student[]>([]);
  filteredStudents = signal<ItemType[]>([]);
  subjects = signal<Subject[]>([]);
  _classes = signal<Class[]>([]);
  classItems = signal<Class[]>([]);
  classId = signal<string>('');

  attendances = signal<any[]>([]);
  summary = signal<{
    total_classes: number;
    attended_classes: number;
    attendance_percentage: number;
  }>({
    total_classes: 0,
    attended_classes: 0,
    attendance_percentage: 0,
  });

  // injection
  private fb = inject(FormBuilder);
  public global = inject(GlobalService);
  public userService = inject(UserService);
  public attendanceService = inject(AttendanceService);
  public attendanceReportService = inject(AttendanceReportService);
  public studentService = inject(StudentService);
  public profileService = inject(ProfileService);

  constructor() {
    this.initForm();
  }

  setStudents(value: ItemType[]) {
    this.students.set(value);
    this.filteredStudents.set([...value]); // initially display all
    this.totalRecords.set(value.length);
  }

  ngOnInit() {
    this.loadSubjects();
    // this.loadData();
  }

  initForm() {
    const item = this.updateItem();
    const form = this.fb.group({
      subject: [item?.subject_id ?? null, Validators.required],
      from_date: [new Date(), [Validators.required]],
      to_date: [new Date(), [Validators.required]],
    });
    console.log('init form');
    this.filterForm.set(form);
  }

  applyFilters() {
    if (this.filterForm()?.controls['subject'].invalid) {
      this.filterForm()?.markAllAsTouched();
      this.global.showAlert('Error!', 'Subject is required.', 'Ok');
      return;
    }
    this.currentPage.set(1); // Reset to first page on new filter
    this.loadData();
  }

  setLoadingIndicator(value: boolean) {
    this.loadingIndicator.set(value);
  }

  updateTotalRecords(num: number) {
    this.totalRecords.update((total) => total + num);
  }

  async loadData() {
    this.setLoadingIndicator(true);
    this.global.showSpinner();

    try {
      const formValue = this.filterForm()?.value;
      const { subject, from_date, to_date } = formValue || {};

      const classId = await this.profileService.profile()?.classData?._id!;

      const params: any = {
        class_id: classId,
        subject: subject,
        from_date: from_date ? new Date(from_date).toISOString() : undefined,
        to_date: to_date ? new Date(to_date).toISOString() : undefined,
        page: this.currentPage(),
        limit: this.pageSize(),
      };

      const response = await this.attendanceService.fetchStudentAttendance(
        params
      );

      console.log('Attendance API response:', response);

      // 👇 Bind data
      const records = response?.data ?? [];
      const pagination = response?.pagination ?? {};
      const summary = response?.summary ?? {
        total_classes: 0,
        attended_classes: 0,
        attendance_percentage: 0,
      };

      this.students.set(records);
      this.filteredStudents.set(records);

      // Bind pagination
      this.totalRecords.set(pagination.totalResults ?? 0);
      this.totalPages.set(pagination.totalPages ?? 0);
      this.currentPage.set(pagination.page ?? 1);

      // Bind summary
      this.summary.set(summary);
    } catch (error) {
      console.error(error);
      this.totalRecords.set(0);
      this.students.set([]);
      this.filteredStudents.set([]);
      this.summary.set({
        total_classes: 0,
        attended_classes: 0,
        attendance_percentage: 0,
      });

      this.global.showErrorMessage(
        error,
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

  async loadSubjects() {
    try {
      const classId = await this.profileService.profile()?.classData?._id!;

      const response = await this.attendanceService.fetchSubjectsByClass(
        classId
      );
      this.subjects.set(response?.data);
    } catch (error) {
      this.global.showAlert('Error!', error, 'OK');
    } finally {
      this.global.hideSpinner();
    }
  }

  onPageChange(event: any) {
    this.currentPage.set(event.offset);
    this.loadData();
  }
}
