import {
  Component,
  viewChild,
  signal,
  inject,
  TemplateRef,
} from '@angular/core';
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
import { SearchFilterInputComponent } from '../../../components/search-filter-input/search-filter-input.component';
import { MatDatepickerFormComponent } from '../../../components/forms/mat-datepicker-form/mat-datepicker-form.component';
import { ContentHeaderComponent } from '../../../components/content-header/content-header.component';
import { SubmitButtonComponent } from '../../../components/buttons/submit-button/submit-button.component';
import { ExcelButtonComponent } from '../../../components/buttons/excel-button/excel-button.component';
import { AppConstants } from '../../../constants/app.constants';
import { GlobalService } from '../../../services/global/global.service';
import { UserService } from '../../../services/user/user.service';
import { SelectFormComponent } from '../../../components/forms/select-form/select-form.component';
import { Student } from '../../../interfaces/student.interface';
import { AttendanceService } from '../../../services/attendance/attendance.service';
import { Subject } from '../../../interfaces/subject.interface';
import { StudentService } from '../../../services/student/student.service';
import { IconRoundButtonComponent } from '../../../components/buttons/icon-round-button/icon-round-button.component';
import { ProfileService } from '../../../services/profile/profile.service';
import { ClassSession } from '../../../interfaces/class-session.interface';
import { Class } from '../../../interfaces/class.interface';
import { RecordsComponent } from './records/records.component';
import { StudentRecord } from '../../../interfaces/student-record.interface';
import { InputFormComponent } from '../../../components/forms/input-form/input-form.component';
import { IconButtonComponent } from '../../../components/buttons/icon-button/icon-button.component';
import { AttendanceReportService } from '../../../services/attendance-report/attendance-report.service';

type ItemType = Student;

@Component({
  selector: 'app-summaries',
  imports: [
    ContentHeaderComponent,
    ReactiveFormsModule,
    SubmitButtonComponent,
    ExcelButtonComponent,
    NgxDatatableModule,
    SearchFilterInputComponent,
    SelectFormComponent,
    IconRoundButtonComponent,
    MatDatepickerFormComponent,
    RecordsComponent,
    InputFormComponent,
    IconButtonComponent,
  ],
  templateUrl: './summaries.component.html',
  styleUrl: './summaries.component.scss',
})
export class SummariesComponent {
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
  _subjects = signal<Subject[]>([]);
  _classes = signal<Class[]>([]);
  classItems = signal<Class[]>([]);
  classId = signal<string>('');
  subjectItems = signal<Subject[]>([]);

  attendances = signal<any[]>([]);

  subject = signal<String>('');

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
    this.loadData();
    //fetch subjects and periods
    this.setClasses();
  }

  initForm() {
    const item = this.updateItem();
    const form = this.fb.group({
      subject: [item?.subject_id ?? null, Validators.required],
      classes: [item?.class_id ?? null, Validators.required],
      from_date: [new Date(), [Validators.required]],
      to_date: [new Date(), [Validators.required]],
      criteria: [item?.criteria ?? 0, [Validators.required]],
    });

    this.filterForm.set(form);
  }

  applyFilters() {
    if (this.filterForm()?.controls['classes'].invalid) {
      this.filterForm()?.markAllAsTouched();
      this.global.showAlert('Error!', 'Class is required.', 'Ok');
      return;
    }
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
    this.setLoadingIndicator(true); // show table loading
    this.global.showSpinner(); // show global spinner

    try {
      const formValue = this.filterForm()?.value;
      const { classes, subject, from_date, to_date, criteria } =
        formValue || {};

      if (!classes) {
        this.setLoadingIndicator(false);
        this.global.hideSpinner();
        return; // Exit if class_id missing
      }

      this.classId.set(classes);
      this.isAllSubjects.set(subject === 'all');

      const params: any = {
        class_id: classes,
        subject_id: subject,
        from_date: from_date ? new Date(from_date).toISOString() : undefined,
        to_date: to_date ? new Date(to_date).toISOString() : undefined,
        criteria,
        page: this.currentPage(),
        limit: this.pageSize(),
        sortField: this.sortField(),
        sortOrder: this.sortOrder(),
        search: this.filterText(),
      };

      const response = await this.attendanceService.fetchAttendanceBySubject(
        params
      );

      const students = response?.data ?? [];
      const pagination = response?.pagination ?? {};

      this.students.set(students);
      this.filteredStudents.set(students);
      this.totalRecords.set(pagination.totalResults ?? 0);
      this.totalPages.set(pagination.totalPages ?? 0);
      this.currentPage.set(pagination.page ?? 1);
    } catch (e) {
      console.log(e);
       this.totalRecords.set(0);
       this.students.set([]);
       this.filteredStudents.set([]);
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

  async onClassSelected(item: Class) {
    try {
      this.global.showSpinner();

      const response = await this.attendanceService.fetchSubjectsByClass(
        item?._id!
      );
      this.subjects(response?.data);
    } catch (error) {
      this.global.showAlert('Error!', error, 'OK');
    } finally {
      this.global.hideSpinner();
    }
  }

  subjects(item: Subject[]) {
    this._subjects.set(item);
    this.subjectItems.set([
      { _id: 'all', subjectLabel: 'All' } as any, // 👈 add All option first
      ...this._subjects().map((c) => ({
        ...c,
        subjectLabel: `${c?.name}`,
      })),
    ]);
  }

  // 6. Simplify onSortChange to set sort state and reload data
  onSortChange(event: any) {
    const sort = event.sorts[0];
    this.sortField.set(sort.prop === 'rollNo' ? 'student_rollNo' : sort.prop); // Use the correct field name from the server response object
    this.sortOrder.set(sort.dir);
    this.currentPage.set(1); // Reset to first page on sort
    this.loadData();
  }

  onFilterChange(event: string) {
    this.filterText.set(event);
    this.currentPage.set(1); // Reset to page 1 for a new search
    this.loadData(); // Trigger server data fetch
  }

  async setClasses() {
    const response = await this.attendanceService.fetchClasses();
    this._classes.set(response);
    //set to the classItems array
    this.classes();
  }

  classes() {
    this.classItems.set(
      this._classes().map((c) => ({
        ...c,
        label: `${c.department?.name} - ${c.year} year - ${c.semester} sem`,
      }))
    );
  }

  onPageChange(event: any) {
    this.currentPage.set(event.offset);
    this.loadData();
  }

  viewRecords(item: StudentRecord, template: TemplateRef<any>) {
    const data: StudentRecord = {
      subject_id: item.subject_id,
      student_id: item?.student_id,
      class_id: item?.class_id,
    };

    if (
      !data?.subject_id ||
      data?.subject_id === 'All' ||
      data?.subject_id === 'all'
    ) {
      this.global.showAlert(
        'Error!',
        'You cannot view all records at a time without export!...',
        'Ok'
      );
      return;
    }
    this.updateRecordItem.set(data);
    this.openAddModal(template);
  }

  async openAddModal(template: TemplateRef<any>) {
    this.global.showModal(template);
  }

  async sendToWhatsapp() {
    try {
      if (!this.classId() || this.classId() === '') {
        this.global.showAlert('Error!', 'Select Class First', 'Ok');
        return;
      }

      this.global.showSpinner();

      let msg = 'Attendance record sent successfully';

      //attendance report generate and upload to the cloudinary
      await this.attendanceReportService.exportAttendanceRecord(
        this.classId(),
        true
      );

      const formValue = this.filterForm()?.value;
      const criteria = formValue?.criteria ? Number(formValue.criteria) : 75;

      //send bulk message to the whatsapp
      await this.attendanceReportService.sendBulkMessage(this.classId(), criteria);

      this.global.showSuccess(
        `${msg}`,
        null,
        5000,
        false,
        'increasing',
        'toast-top-center'
      );
    } catch (error) {
      console.log(error);
      this.global.showAlert('Error!', error, 'OK');
    } finally {
      this.global.hideSpinner();
    }
  }
}
