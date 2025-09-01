import { Component, viewChild, signal, inject } from '@angular/core';
import { ContentHeaderComponent } from '../../../../components/content-header/content-header.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SubmitButtonComponent } from '../../../../components/buttons/submit-button/submit-button.component';
import { ExcelButtonComponent } from '../../../../components/buttons/excel-button/excel-button.component';
import {
  ColumnMode,
  DatatableComponent,
  NgxDatatableModule,
} from '@swimlane/ngx-datatable';
import { DatepipeTextFormatComponent } from '../../../../components/datepipe-text-format/datepipe-text-format.component';
import { User } from '../../../../interfaces/user.interface';
import { AppConstants } from '../../../../constants/app.constants';
import { GlobalService } from '../../../../services/global/global.service';
import { UserService } from '../../../../services/user/user.service';
import { SearchFilterInputComponent } from '../../../../components/search-filter-input/search-filter-input.component';
import { MatDatepickerFormComponent } from "../../../../components/forms/mat-datepicker-form/mat-datepicker-form.component";

type ItemType = User;

@Component({
  selector: 'app-manager-report',
  templateUrl: './manager-report.component.html',
  styleUrl: './manager-report.component.scss',
  imports: [
    ContentHeaderComponent,
    ReactiveFormsModule,
    SubmitButtonComponent,
    ExcelButtonComponent,
    NgxDatatableModule,
    DatepipeTextFormatComponent,
    SearchFilterInputComponent,
    MatDatepickerFormComponent
],
})
export class ManagerReportComponent {
  table = viewChild<DatatableComponent>(DatatableComponent);
  ColumnMode = ColumnMode;
  title = 'MANAGER REPORT';

  managers = signal<ItemType[]>([]);
  loadingIndicator = signal<boolean>(false);
  updateItem = signal<ItemType | null>(null);
  filterForm = signal<FormGroup | null>(null);

  totalRecords = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(AppConstants.PAGE_SIZE);
  sortField = signal<string>('created_at');
  sortOrder = signal<string>('desc');
  filterText = signal<string>('');

  users = signal<User[]>([]);

  private fb = inject(FormBuilder);
  public global = inject(GlobalService);
  public userService = inject(UserService);

  constructor() {
    this.initForm();
  }

  setUsers(value: ItemType[]) {
    this.users.set(value);
  }

  ngOnInit() {
    this.loadData();
  }

  initForm() {
    const form = this.fb.group({
      from_date: [new Date(), [Validators.required]],
      to_date: [new Date(), [Validators.required]],
      // user_id: [null],
    });

    this.filterForm.set(form);
  }

  applyFilters() {
    if (this.filterForm()?.invalid) {
      this.filterForm()?.markAllAsTouched();
      return;
    }

    console.log(this.filterForm()?.value);
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
    try {
      const formValue = this.filterForm()?.value;

      const params = {
        page: this.currentPage() + 1,
        size: this.pageSize(),
        sortField: this.sortField(),
        sortOrder: this.sortOrder(),
        filter: this.filterText(),
        ...formValue,
        from_date: this.global.dateFormat(formValue.from_date, 'yyyy-MM-dd'),
        to_date: this.global.dateFormat(formValue.to_date, 'yyyy-MM-dd'),
      };

      console.log(params);

      this.global.showSpinner();

      const response = await this.userService.getManagers(params);
      console.log(response);

      this.totalRecords.set(response?.pagination?.total);
      this.managers.set(response?.data);

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

  onPageChange(event: any) {
    console.log(event);
    this.currentPage.set(event.offset);
    this.loadData();
  }

  onSortChange(event: any) {
    const sort = event.sorts[0];
    this.sortField.set(sort.prop);
    this.sortOrder.set(sort.dir);
    this.loadData();
  }

  onFilterChange(event: any) {
    this.filterText.set(event);
    this.loadData();
  }
}
