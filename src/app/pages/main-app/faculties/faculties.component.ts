import { Component,inject,input,signal,TemplateRef,viewChild,} from '@angular/core';
import { ColumnMode,DatatableComponent,NgxDatatableModule,} from '@swimlane/ngx-datatable';
import { ContentHeaderComponent } from '../../../components/content-header/content-header.component';
import { GlobalService } from '../../../services/global/global.service';
import { SearchFilterInputComponent } from '../../../components/search-filter-input/search-filter-input.component';
import { AppConstants } from '../../../constants/app.constants';
import { IconRoundButtonComponent } from '../../../components/buttons/icon-round-button/icon-round-button.component';
import { NgClass } from '@angular/common';
import { AddFacultiesComponent } from "./add-faculties/add-faculties.component";
import { Faculty } from '../../../interfaces/faculty.interface';
import { FacultyService } from '../../../services/faculty/faculty.service';

type ItemType = Faculty;

@Component({
  selector: 'app-faculties',
  imports: [
    ContentHeaderComponent,
    NgxDatatableModule,
    SearchFilterInputComponent,
    IconRoundButtonComponent,
    NgClass,
    AddFacultiesComponent,
],
  templateUrl: './faculties.component.html',
  styleUrl: './faculties.component.scss'
})
export class FacultiesComponent {
      table = viewChild<DatatableComponent>(DatatableComponent);
     
       ColumnMode = ColumnMode;
       title = 'FACULTIES';
     
       faculties = signal<ItemType[]>([]);
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
       private facultyService = inject(FacultyService);
     
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
     
           const response = await this.facultyService.getFaculty(params);
           this.setFaculties(response?.data);
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
     
       addData(faculty: ItemType) {
         this.faculties.update((faculties) => [...faculties, faculty]);
         this.updateTotalRecords(1);
         this.loadData();
       }
       
       updateData(faculty: ItemType) {
         this.faculties.update((faculties) =>
           faculties.map((faculty_data) =>
             faculty_data._id === faculty_data._id ? faculty : faculty_data
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
       setFaculties(data: ItemType[]) {
         this.faculties.set(data);
       }
     
       async deleteItem(item: ItemType) {
         try {
           this.global.showSpinner();
     
           console.log('item', item);
           const data = await this.facultyService.deleteFaculty(
             item!._id,
             item!.user_id
           );
     
          console.log(data);

          
           // update table
           this.deleteData(item?._id!);
     
           this.global.showSuccess(
             'Faculty deleted successfully',
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
         this.faculties.update((users) =>
           users.filter((user) => user._id !== userId)
         );
         this.updateTotalRecords(-1);
       }
}
