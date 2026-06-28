import {
  Component,
  viewChild,
  signal,
  inject,
  EventEmitter,
  Output,
  Input,
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
import { ClickButtonComponent } from '../../../components/buttons/click-button/click-button.component';
import { ClassSession } from '../../../interfaces/class-session.interface';
import { Period } from '../../../interfaces/period.interface';

type ItemType = Student;
@Component({
  selector: 'app-attendance',
  imports: [
    ContentHeaderComponent,
    ReactiveFormsModule,
    SubmitButtonComponent,
    ExcelButtonComponent,
    NgxDatatableModule,
    SearchFilterInputComponent,
    SelectFormComponent,
    ClickButtonComponent,
    IconRoundButtonComponent,
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
  filterForm = signal<FormGroup | null>(null);

  totalRecords = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(AppConstants.PAGE_SIZE);
  sortField = signal<string>('created_at');
  sortOrder = signal<string>('desc');
  filterText = signal<string>('');

  students = signal<ItemType[]>([]);
  filteredStudents = signal<ItemType[]>([]);
  subjects = signal<Subject[]>([]);
  _periods = signal<Period[]>([]);

  attendances = signal<any[]>([]);

  subject = signal<String>('');

  private fb = inject(FormBuilder);
  public global = inject(GlobalService);
  public userService = inject(UserService);
  public attendanceService = inject(AttendanceService);
  public studentService = inject(StudentService);
  public profileService = inject(ProfileService);
  private faculty_id = this.profileService.profile()?._id;

  constructor() {
    this.initForm();
  }

  setStudents(value: ItemType[]) {
    this.students.set(value);
    this.filteredStudents.set([...value]); // initially display all
    this.totalRecords.set(value.length);
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.loadData();

    //fetch subjects and periods
    this.setSubjects();
    this.setPeriods();
  }

  initForm() {
    const item = this.updateItem();
    const form = this.fb.group({
      subject: [item?.subject_id ?? null, Validators.required],
      period: [item?.period ?? null, Validators.required],
    });

    this.filterForm.set(form);
  }

  applyFilters() {
    if (this.filterForm()?.invalid) {
      this.filterForm()?.markAllAsTouched();
      this.global.showAlert('Error!', 'Select subject and period', 'Ok');
      return;
    }

    this.loadData();
  }

  markAttendance(row: any, status: 'present' | 'absent') {
    row.status = status; // assign status only for that row
    //creates an array
    const payload = {
      student_id: row?._id,
      status,
    };

    // update or insert into signal
    this.attendances.update((list) => {
      const index = list.findIndex(
        (att) => att.student_id === payload.student_id
      );

      if (index > -1) {
        // update existing student status
        list[index] = payload;
        return [...list]; // return new reference
      } else {
        // add new student payload
        return [...list, payload];
      }
    });
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

      //subjects for logged in faculty if present
      const subjectId = this.profileService.profile()!.subjects![0]._id;
      if (!subjectId) {
        this.global.showAlert('Error!', 'No subjects assigned to you', 'Ok');
      }
      const subject_id = formValue?.subject || subjectId;
      const response = await this.attendanceService.filterStudentBySubject(
        subject_id
      );

      console.log('response', response);

      // set all students
      this.students.set(response?.data || []);
      this.filteredStudents.set([...(response?.data || [])]); // display initially
      this.totalRecords.set(response?.total || 0);
    } catch (e) {
      console.log('attendance error', e);

      this.students.set([]);
      this.filteredStudents.set([]); // display initially
      this.totalRecords.set(0);

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

  periods() {
    return this._periods().map((p) => ({
      ...p,
      label: `${p.period_text} - ${p.start_time} to ${p.ending_time}`,
    }));
  }

  onSortChange(event: any) {
    const sort = event.sorts[0];
    const field = sort.prop;
    const dir = sort.dir;

    // Only sort on user fields or other fields, skip rollNo
    if (field === 'rollNo') return;

    const sorted = [...this.filteredStudents()].sort((a: any, b: any) => {
      const valA = field.includes('user.')
        ? a.user[field.split('.')[1]]
        : a[field];
      const valB = field.includes('user.')
        ? b.user[field.split('.')[1]]
        : b[field];

      if (typeof valA === 'string')
        return dir === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      return dir === 'asc' ? valA - valB : valB - valA;
    });

    this.filteredStudents.set(sorted);
  }

  onFilterChange(event: string) {
    this.setLoadingIndicator(true); // show spinner during filter

    setTimeout(() => {
      const search = event.toLowerCase();

      const filtered = this.students().filter(
        (student) =>
          student?.user?.name?.toLowerCase().includes(search) ||
          student?.user?.email?.toLowerCase().includes(search) ||
          student?.rollNo?.toString().includes(search)
      );

      this.filteredStudents.set(filtered);
      this.totalRecords.set(filtered.length);

      this.setLoadingIndicator(false); // hide spinner after filter
    }, 100); // small delay to allow UI update
  }

  async setSubjects() {
    // const response = await this.attendanceService.getAllSubjects();
    //reduces api call for getting all subjects. instead we can show only assigned subjects.
    const subjects: Subject[] = this.profileService.profile()?.subjects!;
    this.subjects.set(subjects);
  }

  async setPeriods() {
    const response = await this.attendanceService.fetchAllPeriods();
    this._periods.set(response?.data);
  }

  async saveAttendance() {
    try {
      this.global.showSpinner(); // show global spinner

      if (this.students()?.length !== this.attendances()?.length) {
        this.global.showAlert('Error!', 'mark all students attendance..', 'Ok');
        return;
      }

      let msg = 'saved';

      //create payload for session creation
      const formValue = this.filterForm()?.value;
      const payload = {
        subject_id: formValue?.subject,
        faculty_id: this.faculty_id,
        period_id: formValue?.period,
        date: new Date().toISOString(),
        attendance: JSON.stringify(this.attendances()),
      };

      console.log('payload', payload);
      //save attendance
      const response = await this.attendanceService.markAttendance(payload);

      this.global.showSuccess(
        `${response?.data?.message}`,
        null,
        5000,
        false,
        'increasing',
        'toast-top-center'
      );
    } catch (error) {
      this.global.showAlert('Error!', error, 'Ok');
    } finally {
      //hide spinner
      this.global.hideSpinner();
    }
  }
}
