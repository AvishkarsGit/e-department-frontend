import {
  Component,
  viewChild,
  signal,
  inject,
  EventEmitter,
  Output,
  Input,
  TemplateRef,
  input,
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
  subjectItems = signal<Subject[]>([]);

  attendances = signal<any[]>([]);

  subject = signal<String>('');

  private fb = inject(FormBuilder);
  public global = inject(GlobalService);
  public userService = inject(UserService);
  public attendanceService = inject(AttendanceService);
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
    });

    // load attendance criteria


    this.filterForm.set(form);
  }



  isAllSubjects() {
    const formValue = this.filterForm()?.value;
    // Ensure only the value (_id string) is checked
    const subject = formValue?.subject;
    return !subject || subject.toString().toLowerCase() === 'all';
  }

  applyFilters() {
    if (this.filterForm()?.controls['classes'].invalid) {
      this.filterForm()?.markAllAsTouched();
      this.global.showAlert('Error!', 'Class is required.', 'Ok');
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

      // Note: subject_id can be 'all' or null, so we use optional chaining
      const subject_id = formValue?.subject ?? 'all'; //later assign id of subject that assigns to the faculty

      const params: any = {
        // Required filters
        class_id: formValue?.classes,
        // Optional filters
        from_date: new Date(formValue?.from_date).toISOString(),
        to_date: new Date(formValue?.to_date).toISOString(),
        subject_id,
        page: this.currentPage(),
        limit: this.pageSize(),
        sortField: this.sortField(),
        sortOrder: this.sortOrder(),
        search: this.filterText(),
      };

      if (!params.class_id) {
        this.setLoadingIndicator(false);
        this.global.hideSpinner();
        return; // Exit if class_id is missing on initial load
      }

      const response = await this.attendanceService.fetchAttendanceBySubject(
        params
      );

      // set all student
      this.students.set(response?.data || []);
      this.filteredStudents.set(response?.data || []); // ngx-datatable uses filteredStudents for display

      // Update pagination signals from server response
      this.totalRecords.set(response?.pagination?.totalResults || 0);
      this.totalPages.set(response?.pagination?.totalPages || 0);
      this.currentPage.set(response?.pagination?.page || 1);
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
}
