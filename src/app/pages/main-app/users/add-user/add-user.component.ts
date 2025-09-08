import { Component, inject, input, output, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SubmitButtonComponent } from '../../../../components/buttons/submit-button/submit-button.component';
import { InputFormComponent } from '../../../../components/forms/input-form/input-form.component';
import { GlobalService } from '../../../../services/global/global.service';
import { UserService } from '../../../../services/user/user.service';
import { Role, User } from '../../../../interfaces/user.interface';
//import { SelectFormComponent } from '../../../../components/forms/select-form/select-form.component';
import { ToggleFormButtonComponent } from '../../../../components/forms/toggle-form-button/toggle-form-button.component';
import { FileInputComponent } from '../../../../components/forms/file-input/file-input.component';

@Component({
  selector: 'app-add-user',
  imports: [
    ReactiveFormsModule,
    SubmitButtonComponent,
    InputFormComponent,
    //SelectFormComponent,
    ToggleFormButtonComponent,
    FileInputComponent,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent {
  formData = signal<FormGroup | null>(null);
  isSignup = input<boolean>(false);
  register = output<User>();
  roles = input<Role[]>([]);
  updateItem = input<User>();

  added = output<User>();
  updated = output<User>();

  private formBuilder = inject(FormBuilder);
  private global = inject(GlobalService);
  private userService = inject(UserService);

  constructor() {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const item = this.updateItem();
    
    const form = this.formBuilder.group({
      name: [item?.name || null, Validators.required],
      role: [item?.role || null, Validators.required], //role
      // role_id: [
      //   item?.role || (this.isSignup() ? 'admin' : null),
      //   Validators.required,
      // ],
      email: [item?.email || null, [Validators.required, Validators.email]],
      phone: [
        item?.phone || null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      password: [
        null,
        [
          Validators.minLength(8),
          this.updateItem() ? null : Validators.required,
        ].filter(Boolean), // Removes `null` values
      ],
      account_status: [item?.account_status || true, Validators.required],
      photo: [item?.photo || null],
    });

    this.formData.set(form);
  }

  onSubmit() {
    if (this.formData()?.invalid) {
      console.log('submit');
      this.formData()?.markAllAsTouched();
      return;
    }

    if (this.isSignup()) {
      this.register.emit(this.formData()?.value);
      return;
    }

    this.addUser();
  }

  async addUser() {
    try {
      this.global.showSpinner();

      let msg = 'added';
      let data: User;

      // check if update is requested
      if (this.updateItem()) {
        // update item

        msg = 'updated';

        data = await this.userService.updateUser(
          this.updateItem()!._id,
          this.formData()?.value
        );
        // update records
        this.updated.emit(data);
      } else {
        data = await this.userService.addUser(this.formData()?.value);
        // update records
        this.added.emit(data);
      }
      console.log(data);

      this.global.showSuccess(
        `User ${msg} successfully`,
        null,
        5000,
        false,
        'increasing',
        'toast-top-center'
      );

      this.global.hideModal();
    } catch (e) {
      console.log(e);
      this.global.showAlert('Error!', e, 'OK');
    } finally {
      this.global.hideSpinner();
    }
  }
}
