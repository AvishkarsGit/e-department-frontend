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
import { Role, User } from '../../../interfaces/user.interface';
import { ContentHeaderComponent } from '../../../components/content-header/content-header.component';
import { GlobalService } from '../../../services/global/global.service';
import { AddUserComponent } from './add-user/add-user.component';
// import { Role } from '../../../interfaces/role.interface';
import { UserService } from '../../../services/user/user.service';
import { RoleService } from '../../../services/role/role.service';
import { ToggleButtonComponent } from '../../../components/buttons/toggle-button/toggle-button.component';
// import { AddButtonComponent } from '../../../components/buttons/add-button/add-button.component';
import { SearchFilterInputComponent } from '../../../components/search-filter-input/search-filter-input.component';
import { ExcelButtonComponent } from '../../../components/buttons/excel-button/excel-button.component';
import { AppConstants } from '../../../constants/app.constants';
import { IconRoundButtonComponent } from '../../../components/buttons/icon-round-button/icon-round-button.component';
import { Strings } from '../../../enums/strings';
import { NgClass } from '@angular/common';

type ItemType = User;

@Component({
  selector: 'app-users',
  imports: [
    ContentHeaderComponent,
    NgxDatatableModule,
    AddUserComponent,
    ToggleButtonComponent,
    // AddButtonComponent,
    SearchFilterInputComponent,
    ExcelButtonComponent,
    IconRoundButtonComponent,
    NgClass,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  table = viewChild<DatatableComponent>(DatatableComponent);

  ColumnMode = ColumnMode;
  title = 'USERS';

  avatar = Strings.AVATAR_IMAGE;

  users = signal<ItemType[]>([]);
  loadingIndicator = signal<boolean>(false);
  roles = signal<Role[]>([]);
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
  private userService = inject(UserService);
  private roleService = inject(RoleService);

  constructor() {}

  ngOnInit() {
    this.loadData();
  }

  setUsers(data: ItemType[]) {
    this.users.set(data);
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

      console.log('params : ', params);

      this.global.showSpinner();

      const response = await this.userService.getUsers(params);
      console.log(response);

      this.setUsers(response?.data);
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

  // async getAllUsers() {
  //   try {
  //     this.global.showSpinner();

  //     const response = await this.userService.getAllUsers();
  //     console.log(response);

  //     this.allUsers.set(response.data);
  //   } catch (e) {
  //     console.log(e);
  //     this.global.showErrorMessage(
  //       e,
  //       null,
  //       3000,
  //       false,
  //       'decreasing',
  //       'toast-top-center'
  //     );
  //   } finally {
  //     this.global.hideSpinner();
  //   }
  // }

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

  // updateFilter(filteredData: any[]) {
  //   // update the rows
  //   this.setUsers(filteredData);
  //   // Whenever the filter changes, always go back to the first page
  //   this.table()!.offset = 0;
  // }

  async openAddModal(template: TemplateRef<any>, update: boolean = false) {
    if (!update) this.updateItem.set(null);

    // if (this.roles()?.length === 0) {
    //   await this.getRoles();
    // }

    this.global.showModal(template);
  }

  async getRoles() {
    try {
      this.global.showSpinner();
      const roles = await this.roleService.getAllRoles();
      console.log(roles);
      this.roles.set(roles);
      // this.global.hideSpinner();
    } catch (e) {
      console.log(e);
      // this.global.hideSpinner();
      this.global.showErrorMessage(
        'Error! Please check & try again...',
        null,
        3000,
        false,
        'decreasing',
        'toast-top-center'
      );
    } finally {
      this.global.hideSpinner();
    }
  }

  async deleteItemAlert(item: ItemType) {
    console.log(item);
    const result = await this.global.showAlert(
      'Are you sure?',
      'You want to delete this user!',
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

  addData(user: ItemType) {
    this.users.update((users) => [...users, user]);
    this.updateTotalRecords(1);
    // this.temp.update((tempUsers) => [...tempUsers, user]);
    // this.refreshTable();
  }

  updateData(updatedUser: ItemType) {
    this.users.update((users) =>
      users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );

    // this.temp.update((tempUsers) =>
    //   tempUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    // );

    // this.refreshTable();
  }

  deleteData(userId: string) {
    this.users.update((users) => users.filter((user) => user._id !== userId));
    this.updateTotalRecords(-1);

    // this.temp.update((tempUsers) =>
    //   tempUsers.filter((user) => user.id !== userId)
    // );

    // this.refreshTable();
  }

  // refreshTable() {
  //   // This ensures that if you are on another page, you return to page 1 when adding a new data.
  //   setTimeout(() => {
  //     if (this.table()) {
  //       this.table()!.offset = 0; // Reset to first page
  //     }
  //   });
  // }

  async deleteItem(item: ItemType) {
    try {
      this.global.showSpinner();

      const data = await this.userService.deleteUser(item?._id);
      console.log(data);

      // update table
      this.deleteData(item?._id);

      this.global.showSuccess(
        'Account deleted successfully',
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
    console.log('item id', item._id);
    this.openAddModal(template, true);
  }

  async onStatusChange(event: any, item: ItemType) {
    try {
      this.global.showSpinner();

      const data = await this.userService.updateUser(item?._id, {
        account_status: event,
      });
      console.log(data);

      // update table
      this.updateData(data);

      this.global.showSuccess(
        `Account status ${event ? 'activated' : 'deactivated'} successfully`,
        null,
        5000,
        false,
        'increasing',
        'toast-top-center'
      );

      // this.global.hideSpinner();
    } catch (e) {
      console.log(e);
      // this.global.hideSpinner();
      this.global.showAlert('Error!', e, 'OK');
    } finally {
      this.global.hideSpinner();
    }
  }
}
