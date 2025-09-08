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
import { AddSubjectComponent } from './add-subject/add-subject.component';
import { Class } from '../../../interfaces/class.interface';

type ItemType = Subject;

@Component({
  selector: 'app-subjects',
  imports: [
    //AddCountryComponent,
    IconRoundButtonComponent,
    NgxDatatableModule,
    ContentHeaderComponent,
    SearchFilterInputComponent,
    // ExcelButtonComponent,
    // AddButtonComponent,
    //  ToggleButtonComponent,
    SafeHtmlPipe,
    AddSubjectComponent,
  ],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss',
})
export class SubjectsComponent {
  table = viewChild<DatatableComponent>(DatatableComponent);

  ColumnMode = ColumnMode;
  title = 'SUBJECTS';

  subjects = signal<ItemType[]>([]);
  loadingIndicator = signal<boolean>(false);
  updateItem = signal<ItemType | null>(null);
  updateClassItem = signal<Subject | null>(null);

  totalRecords = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(AppConstants.PAGE_SIZE);
  sortField = signal<string>('id');
  sortOrder = signal<string>('asc');
  filterText = signal<string>('');

  public global = inject(GlobalService);
  private subjectService = inject(SubjectService);

  constructor() {}

  ngOnInit() {
    this.loadData();
  }

  setSubjects(data: ItemType[]) {
    this.subjects.set(data);
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
      const params = {
        page: this.currentPage() + 1,
        size: this.pageSize(),
        sortField: this.sortField(),
        sortOrder: this.sortOrder(),
        filter: this.filterText(),
      };

      this.global.showSpinner();

      const response = await this.subjectService.getSubjects(params);
      console.log(response);

      this.setSubjects(response?.data);
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

  addData(subject: ItemType) {
    // this.subjects.set([...this.subjects(), subject]);
    // this.updateTotalRecords(1);
    this.loadData();
  }

  updateData(updatedSubject: ItemType) {
    // this.subjects.update((subjects) =>
    //   subjects.map((subject) =>
    //     subject._id === updatedSubject._id ? updatedSubject : subject
    //   )
    // );

    this.loadData();
  }

  deleteData(subjectId: string) {
    this.subjects.update((subjects) =>
      subjects.filter((subject) => subject._id !== subjectId)
    );
    this.updateTotalRecords(-1);
  }

  async deleteItem(item: ItemType) {
    try {
      this.global.showSpinner();

      const data = await this.subjectService.deleteSubject(item?._id);
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
