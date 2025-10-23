import {Component,inject,input,signal,TemplateRef,viewChild,} from '@angular/core';
import {ColumnMode,DatatableComponent,NgxDatatableModule,} from '@swimlane/ngx-datatable';
import { ContentHeaderComponent } from '../../../components/content-header/content-header.component';
import { GlobalService } from '../../../services/global/global.service';
import { SearchFilterInputComponent } from '../../../components/search-filter-input/search-filter-input.component';
import { AppConstants } from '../../../constants/app.constants';
import { IconRoundButtonComponent } from '../../../components/buttons/icon-round-button/icon-round-button.component';
import { NgClass } from '@angular/common';
import { Department } from '../../../interfaces/department.interface';
import { DepartmentService } from '../../../services/department/department.service';
import { AddDepartmentComponent } from "./add-department/add-department.component";


type ItemType = Department;

@Component({
  selector: 'app-departments',
  imports: [
    ContentHeaderComponent,
    NgxDatatableModule,
    SearchFilterInputComponent,
    IconRoundButtonComponent,
    NgClass,
    AddDepartmentComponent
],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent {
  table = viewChild<DatatableComponent>(DatatableComponent);

  ColumnMode = ColumnMode;
  title = 'DEPARTMENTS';

  departments = signal<ItemType[]>([]);
  loadingIndicator = signal<boolean>(false);;
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
  private departmentService = inject(DepartmentService);

  constructor() { }
  ngOnInit() {
    this.loadData();
  }

  setDepartments(data: ItemType[]) {
    this.departments.set(data);
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

      const response = await this.departmentService.getDepartments(params);

      this.setDepartments(response?.data);
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
    console.log('event :', event);
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
    console.log('event', event);
    this.filterText.set(event);
    this.loadData();
  }

  async openAddModal(template: TemplateRef<any>, update: boolean = false) {
    if (!update) this.updateItem.set(null);
    this.global.showModal(template);
  }

  async deleteItemAlert(item: ItemType) {
    console.log(item);
    const result = await this.global.showAlert(
      'Are you sure?',
      'You want to delete this Department!',
      'YES',
      false,
      'NO',
      'question'
    );
    if (result.isConfirmed) {
      this.deleteItem(item);
    } else if (result.dismiss === this.global.cancelSwal()) {
      // enter any functionality here
    }
  }

  addData(department: ItemType) {
    this.departments.update((departments) => [...departments, department]);
    this.updateTotalRecords(1);
  }

  updateData(updatedDepatment: ItemType) {
    this.departments.update((departments) =>
      departments.map((department) => (department._id === updatedDepatment._id ? updatedDepatment : department))
    );
  }

  deleteData(departmentId: string) {
    this.departments.update((departments) => departments.filter((department) => department._id !== departmentId));
    this.updateTotalRecords(-1);
  }

  async deleteItem(item: ItemType) {
    try {
      this.global.showSpinner();

      const data = await this.departmentService.deleteDepartment(item?._id);
      console.log(data);

      // update table
      this.deleteData(item?._id);

      this.global.showSuccess(
        'Department deleted successfully',
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

  editItem(item: ItemType, template: TemplateRef<any>) {
    this.updateItem.set(item);
    this.openAddModal(template, true);
  }

}
