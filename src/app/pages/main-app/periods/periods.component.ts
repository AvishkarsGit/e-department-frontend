import {
  Component,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  DatatableComponent,
  NgxDatatableModule,
} from '@swimlane/ngx-datatable';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { AppConstants } from '../../../constants/app.constants';
import { GlobalService } from '../../../services/global/global.service';
import { IconRoundButtonComponent } from '../../../components/buttons/icon-round-button/icon-round-button.component';
import { ContentHeaderComponent } from '../../../components/content-header/content-header.component';
import { SearchFilterInputComponent } from '../../../components/search-filter-input/search-filter-input.component';
import { ExcelButtonComponent } from '../../../components/buttons/excel-button/excel-button.component';
// import { AddButtonComponent } from '../../../components/buttons/add-button/add-button.component';
// import { AddCountryComponent } from './add-country/add-country.component';
import { ToggleButtonComponent } from '../../../components/buttons/toggle-button/toggle-button.component';
import { SafeHtmlPipe } from '../../../pipes/safe-html/safe-html.pipe';
import { Subject } from '../../../interfaces/subject.interface';
import { SubjectService } from '../../../services/subject/subject.service';
import { Class } from '../../../interfaces/class.interface';
import { AddSubjectComponent } from '../subjects/add-subject/add-subject.component';
import { AddPeriodComponent } from './add-period/add-period.component';
import { Period } from '../../../interfaces/period.interface';
import { PeriodService } from '../../../services/periods/period.service';

type ItemType = Period;
@Component({
  selector: 'app-periods',
  imports: [
    IconRoundButtonComponent,
    NgxDatatableModule,
    ContentHeaderComponent,
    SearchFilterInputComponent,
    AddPeriodComponent,
  ],
  templateUrl: './periods.component.html',
  styleUrl: './periods.component.scss',
})
export class PeriodsComponent {
  table = viewChild<DatatableComponent>(DatatableComponent);

  ColumnMode = ColumnMode;
  title = 'PERIODS';

  periods = signal<ItemType[]>([]);
  allPeriods = signal<ItemType[]>([]);
  loadingIndicator = signal<boolean>(false);
  updateItem = signal<ItemType | null>(null);

  totalRecords = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(AppConstants.PAGE_SIZE);
  sortField = signal<string>('id');
  sortOrder = signal<string>('asc');
  filterText = signal<string>('');

  public global = inject(GlobalService);
  private periodService = inject(PeriodService);

  constructor() {}

  ngOnInit() {
    this.loadData();
  }

  setPeriods(data: ItemType[]) {
    this.allPeriods.set(data);
  }

  setLoadingIndicator(value: boolean) {
    this.loadingIndicator.set(value);
  }

  updateTotalRecords(num: number) {
    this.totalRecords.update((total) => total + num);
  }

  paginateData() {
    const start = this.currentPage() * this.pageSize();
    const end = start + this.pageSize();
    this.periods.set(this.allPeriods().slice(start, end));
    this.totalRecords.set(this.allPeriods()?.length);
  }

  async loadData() {
    this.setLoadingIndicator(true);
    try {
      this.global.showSpinner();
      //fetch all once
      const response = await this.periodService.getAllPeriods();
      this.setPeriods(response?.data ?? []);
      //paginate the data
      this.paginateData();
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
    this.paginateData();
  }

  onFilterChange(event: any) {
    this.filterText.set(event);
    // apply filtering on allPeriods, then paginate
    let filtered = this.allPeriods();
    if (event) {
      const regex = new RegExp(event, 'i');
      filtered = this.allPeriods().filter(
        (p) => regex.test(p.period_text) || regex.test(p.period)
      );
    }
    this.totalRecords.set(filtered.length);
    const start = this.currentPage() * this.pageSize();
    const end = start + this.pageSize();
    this.periods.set(filtered.slice(start, end));
  }

  // updateFilter(filteredData: any[]) {
  //   // update the rows
  //   this.setUsers(filteredData);
  //   // Whenever the filter changes, always go back to the first page
  //   this.table()!.offset = 0;
  // }

  async openAddModal(template: TemplateRef<any>, update: boolean = false) {
    if (!update) this.updateItem.set(null);

    this.global.showModal(template);
  }

  async deleteItemAlert(item: ItemType) {
    const result = await this.global.showAlert(
      'Are you sure?',
      'You want to delete this subject!',
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

  addData(period: ItemType) {
    this.periods.update((periods) => [...periods, period]);
    this.updateTotalRecords(1);
  }

  updateData(updatedPeriod: ItemType) {
    this.periods.update((periods) =>
      periods.map((period) =>
        period._id === updatedPeriod._id ? updatedPeriod : period
      )
    );
  }

  deleteData(periodId: string) {
    this.periods.update((periods) =>
      periods.filter((period) => period._id !== periodId)
    );
    this.updateTotalRecords(-1);
  }

  async deleteItem(item: ItemType) {
    try {
      this.global.showSpinner();

      const data = await this.periodService.deletePeriod(item?._id);
      console.log(data);

      //update table
      this.deleteData(item?._id);

      this.global.showSuccess(
        'Country deleted successfully',
        null,
        5000,
        false,
        'increasing',
        'toast-top-center'
      );
    } catch (e) {
      console.log(e);
      this.global.showAlert('Error!', e, 'OK');
    } finally {
      this.global.hideSpinner();
    }
  }

  editItem(item: ItemType, template: TemplateRef<any>) {
    this.updateItem.set(item);
    this.openAddModal(template, true);
  }
}
