import { Component, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { ColumnMode, DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderComponent } from '../../../components/content-header/content-header.component';
import { GlobalService } from '../../../services/global/global.service';
import { SearchFilterInputComponent } from '../../../components/search-filter-input/search-filter-input.component';
import { AppConstants } from '../../../constants/app.constants';
import { IconRoundButtonComponent } from '../../../components/buttons/icon-round-button/icon-round-button.component';
import { Faculty } from '../../../interfaces/faculty.interface';
import { FacultyService } from '../../../services/faculty/faculty.service';
import { ViewProfileComponent } from '../view-profile/view-profile.component';
import { UserProfile } from '../../../interfaces/user-profile.interface';
import { AddFacultiesComponent } from './add-faculties/add-faculties.component';

type ItemType = Faculty;

@Component({
  selector: 'app-faculties',
  imports: [
    ContentHeaderComponent,
    NgxDatatableModule,
    SearchFilterInputComponent,
    IconRoundButtonComponent,
    ViewProfileComponent,
    AddFacultiesComponent,
  ],
  templateUrl: './faculties.component.html',
  styleUrl: './faculties.component.scss',
})
export class FacultiesComponent {
  table = viewChild<DatatableComponent>(DatatableComponent);
  viewProfileComp = viewChild(ViewProfileComponent);

  ColumnMode = ColumnMode;
  title = 'FACULTIES';

  faculties = signal<ItemType[]>([]);
  loadingIndicator = signal<boolean>(false);
  updateItem = signal<ItemType | null>(null);
  updateProfileItem = signal<UserProfile | null>(null);
  role = signal<string>('faculty');

  totalRecords = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(AppConstants.PAGE_SIZE);
  sortField = signal<string>('id');
  sortOrder = signal<string>('asc');
  filterText = signal<string>('');

  public global = inject(GlobalService);
  private facultyService = inject(FacultyService);

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

  async deleteItemAlert(item: ItemType) {
    const result = await this.global.showAlert(
      'Are you sure?',
      'You want to delete this faculty!',
      'YES',
      false,
      'NO',
      'question'
    );
    if (result.isConfirmed) {
      this.deleteItem(item);
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

      this.global.showSpinner();
      const response = await this.facultyService.getFaculty(params);
      this.setFaculties(response?.data);
      this.totalRecords.set(response?.pagination?.total);
    } catch (e) {
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

  updateData() {
    this.loadData(); //load latest data
  }

  setLoadingIndicator(value: boolean) {
    this.loadingIndicator.set(value);
  }

  updateTotalRecords(num: number) {
    this.totalRecords.update((total) => total + num);
  }
  setFaculties(data: ItemType[]) {
    this.faculties.set(data);
  }

  async deleteItem(item: ItemType) {
    try {
      this.global.showSpinner();
      await this.facultyService.deleteFaculty(item!._id, item!.user_id);
      this.deleteData(item?._id!);
      this.global.showSuccess(
        'Faculty deleted successfully',
        null,
        5000,
        false,
        'increasing',
        'toast-top-center'
      );
    } catch (e) {
      this.global.showAlert('Error!', e, 'OK');
    } finally {
      this.global.hideSpinner();
    }
  }

  deleteData(userId: string) {
    this.faculties.update((users) =>
      users.filter((user) => user._id !== userId)
    );
    this.updateTotalRecords(-1);
  }

  viewProfile(item: ItemType, template: TemplateRef<any>) {
    this.prepareData(item);
    this.global.showModal(template);
  }

  uploadSubjects(item: ItemType, template: TemplateRef<any>) {
    this.updateItem.set(item);
    this.openAddModal(template, true);
  }

  prepareData(item: ItemType) {
    const data: UserProfile = {
      _id: item?._id,
      name: item?.user?.name,
      email: item?.user?.email,
      phone: item?.user?.phone,
      photo: item?.user?.photo!,
      username: item?.user?.username,
      role: item?.user?.role,
      department: item?.department?.name,
      emailVerified: item?.user?.email_verified,
      subjects: item?.subjects,
      createdAt: item?.user?.created_at!,
    };
    this.updateProfileItem.set(data);
  }
}
