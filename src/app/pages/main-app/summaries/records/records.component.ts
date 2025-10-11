import {
  Component,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
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
import {
  ColumnMode,
  DatatableComponent,
  NgxDatatableModule,
} from '@swimlane/ngx-datatable';
import { ExcelButtonComponent } from '../../../../components/buttons/excel-button/excel-button.component';
import { AppConstants } from '../../../../constants/app.constants';
import { ClassSession } from '../../../../interfaces/class-session.interface';
import { SearchFilterInputComponent } from '../../../../components/search-filter-input/search-filter-input.component';
import { MatDatepickerFormComponent } from '../../../../components/forms/mat-datepicker-form/mat-datepicker-form.component';
import { AttendanceService } from '../../../../services/attendance/attendance.service';
import { StudentRecord } from '../../../../interfaces/student-record.interface';

type ItemType = StudentRecord;

@Component({
  selector: 'app-records',
  imports: [
    ReactiveFormsModule,
    NgxDatatableModule,
    MatDatepickerFormComponent,
    SubmitButtonComponent,
  ],
  templateUrl: './records.component.html',
  styleUrl: './records.component.scss',
})
export class RecordsComponent {
  table = viewChild<DatatableComponent>(DatatableComponent);

  ColumnMode = ColumnMode;
  title = 'SUBJECTS';

  records = signal<ItemType[]>([]);
  loadingIndicator = signal<boolean>(false);
  updateRecordItem = input<ItemType>();

  totalRecords = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(AppConstants.PAGE_SIZE);
  sortField = signal<string>('id');
  sortOrder = signal<string>('asc');
  filterText = signal<string>('');
  formData = signal<FormGroup | null>(null);

  private formBuilder = inject(FormBuilder);
  private global = inject(GlobalService);
  public attendanceService = inject(AttendanceService);

  constructor() {}

  ngOnInit() {
    this.initForm();

    //load the data
    this.loadData();
  }

  initForm() {
    const form = this.formBuilder.group({
      from_date: [null],
      to_date: [null],
    });

    this.formData.set(form);
  }

  async loadData() {
    this.setLoadingIndicator(true); // show table loading
    this.global.showSpinner(); // show global spinner

    try {
      const params: any = {
        // Required filters
        class_id: this.updateRecordItem()?.class_id,
        subject_id: this.updateRecordItem()?.subject_id,
        student_id: this.updateRecordItem()?.student_id,

        // Optional filters
        page: this.currentPage() + 1,
        size: this.pageSize(),
      };

      if (
        this.formData()?.value?.from_date &&
        this.formData()?.value?.to_date
      ) {
        params.from_date = this.formData()?.value?.from_date;
        params.to_date = this.formData()?.value?.to_date;
      }

      const response = await this.attendanceService.getStudentAttendance(
        params
      );
      const flattened = response.data.map((a: any, index: number) => ({
        sr_no: index + 1,
        date: new Date(a.date).toLocaleDateString(),
        status: a.status.toUpperCase(),
        period_text: a.session_id?.period?.period_text || '',
      }));

      this.records.set(flattened);
      this.totalRecords.set(flattened.length);
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
  setLoadingIndicator(value: boolean) {
    this.loadingIndicator.set(value);
  }
  onSubmit() {
    if (this.formData()?.invalid) {
      this.formData()?.markAllAsTouched();
      return;
    }

    //load data
    this.loadData();
  }

  onPageChange(event: any) {
    console.log(event);
    this.currentPage.set(event.offset);
    this.loadData();
  }

  onSortChange(event: any) {
    const sort = event.sorts[0];

    if (!sort?.prop) return;

    this.sortField.set(sort.prop);
    this.sortOrder.set(sort.dir);
    this.loadData();
  }

  onFilterChange(event: any) {
    console.log(event);
    this.filterText.set(event);
    this.loadData();
  }
}
