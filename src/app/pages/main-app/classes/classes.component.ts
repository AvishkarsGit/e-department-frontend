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
import { Class } from '../../../interfaces/class.interface';
import { ClassService } from '../../../services/class/class.service';
import { AddClassComponent } from './add-class/add-class.component';

type ItemType = Class;

@Component({
  selector: 'app-classes',
  imports: [
    ContentHeaderComponent,
    NgxDatatableModule,
    SearchFilterInputComponent,
    IconRoundButtonComponent,
    NgClass,
    AddClassComponent,
  ],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.scss',
})
export class ClassesComponent {
  table = viewChild<DatatableComponent>(DatatableComponent);

  ColumnMode = ColumnMode;
  title = 'CLASSES';

  classes = signal<ItemType[]>([]);
  loadingIndicator = signal<boolean>(false);
  updateItem = signal<ItemType | null>(null);

  totalRecords = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(AppConstants.PAGE_SIZE);
  sortField = signal<string>('id');
  sortOrder = signal<string>('asc');
  filterText = signal<string>('');

  // check card for component reusability
  isCard = input<boolean>(false);

  public global = inject(GlobalService);
  private classService = inject(ClassService);

  constructor() {}

  ngOnInit() {
    this.loadData();
  }

  async openAddModal(template: TemplateRef<any>, update: boolean = false) {
    if (!update) this.updateItem.set(null);
    this.global.showModal(template);
  }

  onPageChange(event: any) {
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
    this.filterText.set(event);
    this.loadData();
  }

  editItem(item: ItemType, template: TemplateRef<any>) {
    this.updateItem.set(item);
    this.openAddModal(template, true);
  }

  async deleteItemAlert(item: ItemType) {
    const result = await this.global.showAlert(
      'Are you sure?',
      'You want to delete this department!',
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

      console.log('params : ', params);

      this.global.showSpinner();

      const response = await this.classService.getClasses(params);
      this.setClasses(response?.data);
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

  addData(classData: ItemType) {
    // this.classes.update((classes) => [...classes, classData]);
    // this.updateTotalRecords(1);
    this.loadData();
  }

  updateData(classData: ItemType) {
    // this.classes.update((classes) =>
    //   classes.map((class_data) =>
    //     class_data._id === class_data._id ? classData : class_data
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
  setClasses(data: ItemType[]) {
    this.classes.set(data);
  }

  async deleteItem(item: ItemType) {
    try {
      this.global.showSpinner();

      const data = await this.classService.deleteDepartment(item?._id!);
      console.log(data);

      // update table
      this.deleteData(item?._id!);

      this.global.showSuccess(
        'Class deleted successfully',
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
    this.classes.update((users) => users.filter((user) => user._id !== userId));
    this.updateTotalRecords(-1);
  }
}
