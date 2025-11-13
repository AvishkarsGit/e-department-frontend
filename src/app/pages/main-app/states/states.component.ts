import {
  Component,
  signal,
  viewChild,
  inject,
  TemplateRef,
} from '@angular/core';
import {
  ColumnMode,
  DatatableComponent,
  NgxDatatableModule,
} from '@swimlane/ngx-datatable';
import { AppConstants } from '../../../constants/app.constants';
import { GlobalService } from '../../../services/global/global.service';
import { StateService } from '../../../services/state/state.service';
import { State } from '../../../interfaces/state.interface';
import { AddStateComponent } from './add-state/add-state.component';
import { ContentHeaderComponent } from '../../../components/content-header/content-header.component';
import { SearchFilterInputComponent } from '../../../components/search-filter-input/search-filter-input.component';
import { ExcelButtonComponent } from '../../../components/buttons/excel-button/excel-button.component';
// import { AddButtonComponent } from '../../../components/buttons/add-button/add-button.component';
import { ToggleButtonComponent } from "../../../components/buttons/toggle-button/toggle-button.component";
import { IconRoundButtonComponent } from "../../../components/buttons/icon-round-button/icon-round-button.component";
import { PrintButtonComponent } from "../../../components/buttons/print-button/print-button.component";

type ItemType = State;

@Component({
  selector: 'app-states',
  imports: [
    AddStateComponent,
    ContentHeaderComponent,
    SearchFilterInputComponent,
    ExcelButtonComponent,
    // AddButtonComponent,
    NgxDatatableModule,
    ToggleButtonComponent,
    IconRoundButtonComponent,
    PrintButtonComponent
],
  templateUrl: './states.component.html',
  styleUrl: './states.component.scss',
})
export class StatesComponent {
  table = viewChild<DatatableComponent>(DatatableComponent);

  ColumnMode = ColumnMode;
  title = 'STATES';

  states = signal<ItemType[]>([]);
  loadingIndicator = signal<boolean>(false);
  updateItem = signal<ItemType | null>(null);

  totalRecords = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(AppConstants.PAGE_SIZE);
  sortField = signal<string>('id');
  sortOrder = signal<string>('asc');
  filterText = signal<string>('');

  public global = inject(GlobalService);
  private stateService = inject(StateService);

  constructor() {}

  ngOnInit() {
    this.loadData();
  }

  setStates(data: ItemType[]) {
    this.states.set(data);
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

      // const response = await this.stateService.getStates(params);
      // console.log(response);

      // this.setStates(response?.data);
      // this.totalRecords.set(response?.pagination?.total);
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

    if(!sort?.prop) return;

    this.sortField.set(sort.prop);
    this.sortOrder.set(sort.dir);
    this.loadData();
  }

  onFilterChange(event: any) {
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
      'You want to delete this state!',
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

  addData(state: ItemType) {
    this.states.update((states) => [...states, state]);
    this.updateTotalRecords(1);
  }

  updateData(updatedState: ItemType) {
    this.states.update((states) =>
      states.map((state) =>
        state.id === updatedState.id ? updatedState : state
      )
    );
  }

  deleteData(stateId: number) {
    this.states.update((states) =>
      states.filter((state) => state.id !== stateId)
    );
    this.updateTotalRecords(-1);
  }

  async deleteItem(item: ItemType) {
    try {
      this.global.showSpinner();

      const data = await this.stateService.deleteState(item?.id);
      console.log(data);

      // update table
      this.deleteData(item?.id);

      this.global.showSuccess(
        'state deleted successfully',
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

  async onStatusChange(event: any, item: ItemType) {
    console.log(event);

    try {
      this.global.showSpinner();

      const data = await this.stateService.updateState(item?.id, {
        status: event,
      });
      console.log(data);

      // update table
      this.updateData(data);

      this.global.showSuccess(
        `${item?.name} status ${
          event ? 'activated' : 'deactivated'
        } successfully`,
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
}
