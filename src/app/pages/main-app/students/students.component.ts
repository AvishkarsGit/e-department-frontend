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
import { AddStudentComponent } from './add-student/add-student.component';
import { Student } from '../../../interfaces/student.interface';
import { StudentService } from '../../../services/student/student.service';

type ItemType = Student;

@Component({
  selector: 'app-students',
  imports: [
    ContentHeaderComponent,
    NgxDatatableModule,
    SearchFilterInputComponent,
    IconRoundButtonComponent,
    NgClass,
    AddStudentComponent,
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
})
export class StudentsComponent {
  table = viewChild<DatatableComponent>(DatatableComponent);

  ColumnMode = ColumnMode;
  title = 'STUDENTS';

  students = signal<ItemType[]>([]);
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
  private studentService = inject(StudentService);

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
    console.log('updated item', this.updateItem());
    this.openAddModal(template, true);
  }

  async deleteItemAlert(item: ItemType) {
    const result = await this.global.showAlert(
      'Are you sure?',
      'You want to delete this student!',
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

      this.global.showSpinner();


      const response = await this.studentService.getStudents(params);
      this.setStudents(response?.data);
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

  addData(student: ItemType) {
    this.students.update((students) => [...students, student]);
    this.updateTotalRecords(1);
    this.loadData();
  }
  
  updateData(student: ItemType) {
    this.students.update((students) =>
      students.map((student_data) =>
        student_data._id === student_data._id ? student : student_data
      )
    );
    this.loadData();
  }

  setLoadingIndicator(value: boolean) {
    this.loadingIndicator.set(value);
  }

  updateTotalRecords(num: number) {
    this.totalRecords.update((total) => total + num);
  }
  setStudents(data: ItemType[]) {
    this.students.set(data);
  }

  async deleteItem(item: ItemType) {
    try {
      this.global.showSpinner();

      console.log('item', item);
      const data = await this.studentService.deleteStudent(
        item!._id,
        item!.user_id
      );

     console.log(data);
      // update table
      this.deleteData(item?._id!);

      this.global.showSuccess(
        'Student deleted successfully',
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
    this.students.update((users) =>
      users.filter((user) => user._id !== userId)
    );
    this.updateTotalRecords(-1);
  }
}
