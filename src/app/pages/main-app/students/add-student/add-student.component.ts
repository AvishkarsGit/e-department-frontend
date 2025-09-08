import { Component, inject, input, output, signal } from '@angular/core';
import {
  FormArray,
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
import { SelectFormComponent } from '../../../../components/forms/select-form/select-form.component';
import { Class, Semester, Year } from '../../../../interfaces/class.interface';
import { Department } from '../../../../interfaces/department.interface';
import { DepartmentService } from '../../../../services/department/department.service';
import { ClassService } from '../../../../services/class/class.service';
import { Student } from '../../../../interfaces/student.interface';

@Component({
  selector: 'app-add-student',
  imports: [
    ReactiveFormsModule,
    SubmitButtonComponent,
    InputFormComponent,
    //SelectFormComponent,
    //  ToggleFormButtonComponent,
    FileInputComponent,
  ],
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.scss',
})
export class AddStudentComponent {
  formData = signal<FormGroup | null>(null);
  isSignup = input<boolean>(false);
  register = output<Student>();
  updateItem = input<Student>();

  added = output<Student>();
  updated = output<Student>();

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
      name: [item?.user?.name || null, Validators.required],
      username: [item?.user?.username || null, Validators.required],
      email: [
        item?.user?.email || null,
        [Validators.required, Validators.email],
      ],
      phone: [
        item?.user?.phone || null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      //dynamic phone number
      phoneNumbers: this.formBuilder.array([]),

      password: [
        null,
        [
          Validators.minLength(8),
          this.updateItem() ? null : Validators.required,
        ].filter(Boolean), // Removes `null` values
      ],
      photo: [item?.user?.photo ?? null],
    });

    this.formData.set(form);
  }

  get phoneNumbers(): FormArray {
    return this.formData()?.get('phoneNumbers') as FormArray;
  }

  //add phone number
  addPhoneNumber() {
    this.phoneNumbers.push(
      this.formBuilder.group({
        number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        type: ['home', Validators.required],
      })
    );
  }

  //remove phone numbers
  removePhoneNumber(index: number) {
    this.phoneNumbers.removeAt(index);
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

    console.log('form data:', this.formData()?.value);
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
        //this.updated.emit(data);
      } else {
        data = await this.userService.addUser(this.formData()?.value);
        // update records
        //    this.added.emit(data);
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
