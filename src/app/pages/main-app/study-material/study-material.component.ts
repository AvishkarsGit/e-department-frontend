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
import { ToggleButtonComponent } from '../../../components/buttons/toggle-button/toggle-button.component';
import { SafeHtmlPipe } from '../../../pipes/safe-html/safe-html.pipe';
import { Subject } from '../../../interfaces/subject.interface';
import { SubjectService } from '../../../services/subject/subject.service';
// import { AddSubjectComponent } from './add-subject/add-subject.component';
import { Class } from '../../../interfaces/class.interface';
import { ProfileService } from '../../../services/profile/profile.service';
import { DatePipe, NgClass } from '@angular/common';
import { UploadService } from '../../../services/uploads/upload.service';
import { Upload } from '../../../interfaces/upload.interface';
import { AddStudyMaterialComponent } from './add-study-material/add-study-material.component';
import { saveAs } from 'file-saver';

type ItemType = Upload;
@Component({
  selector: 'app-study-material',
  imports: [
    //AddCountryComponent,
    IconRoundButtonComponent,
    NgxDatatableModule,
    ContentHeaderComponent,
    SearchFilterInputComponent,
    // ExcelButtonComponent,
    // AddButtonComponent,
    //  ToggleButtonComponent,
    DatePipe,
    //AddSubjectComponent,
    AddStudyMaterialComponent,
],
  templateUrl: './study-material.component.html',
  styleUrl: './study-material.component.scss',
})
export class StudyMaterialComponent {
  table = viewChild<DatatableComponent>(DatatableComponent);

  ColumnMode = ColumnMode;
  title = 'MATERIAL';

  uploads = signal<ItemType[]>([]);
  loadingIndicator = signal<boolean>(false);
  updateItem = signal<ItemType | null>(null);

  totalRecords = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(AppConstants.PAGE_SIZE);
  sortField = signal<string>('id');
  sortOrder = signal<string>('asc');
  filterText = signal<string>('');
  userRole = signal<string | null>(null);

  public global = inject(GlobalService);
  private profileService = inject(ProfileService);
  private uploadService = inject(UploadService);

  constructor() {}

  ngOnInit() {
    this.loadData();
  }

  setUploads(data: ItemType[]) {
    this.uploads.set(data);
  }

  setLoadingIndicator(value: boolean) {
    this.loadingIndicator.set(value);
  }

  updateTotalRecords(num: number) {
    this.totalRecords.update((total) => total + num);
  }

  async loadData() {
    this.setLoadingIndicator(true);
    const role = await this.profileService.profile()?.role!;
    this.userRole.set(role);
    try {
      const params = {
        page: this.currentPage() + 1,
        size: this.pageSize(),
        sortField: this.sortField(),
        sortOrder: this.sortOrder(),
        filter: this.filterText(),
      };

      this.global.showSpinner();
      const response = await this.uploadService.getAllMaterial(params);
      this.setUploads(response?.data);
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

  addData() {
    this.loadData();
  }

  updateData() {
    this.loadData();
  }

  deleteData(uploadId: string) {
    this.uploads.update((uploads) =>
      uploads.filter((upload) => upload._id !== uploadId)
    );
    this.updateTotalRecords(-1);
  }

  async deleteItem(item: ItemType) {
    try {
      this.global.showSpinner();

      await this.uploadService.deleteMaterial(item?._id!);

      // update table
      this.deleteData(item?._id!);

      this.global.showSuccess(
        'Material deleted successfully',
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
    console.log(this.updateItem());
    this.openAddModal(template, true);
  }

  async downloadPdf(item: ItemType) {
    try {
      this.global.showSpinner();

      const response = await this.uploadService.downloadFile(item?._id!);

      //save to local (download)
      saveAs(response?.data, 'myfile.pdf');

      this.global.showSuccess(
        'Material deleted successfully',
        null,
        5000,
        false,
        'increasing',
        'toast-top-center'
      );
    } catch (error) {
      this.global.showAlert('Error!', error, 'OK');
    } finally {
      this.global.hideSpinner();
    }
  }
}
