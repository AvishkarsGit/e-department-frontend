import { Component, computed, inject, signal } from '@angular/core';
import { ContentHeaderComponent } from '../../../components/content-header/content-header.component';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FileInputComponent } from '../../../components/forms/file-input/file-input.component';
import { InputFormComponent } from '../../../components/forms/input-form/input-form.component';
import { SubmitButtonComponent } from '../../../components/buttons/submit-button/submit-button.component';
import { SelectFormComponent } from '../../../components/forms/select-form/select-form.component';
import { GlobalService } from '../../../services/global/global.service';
import { ProfileService } from '../../../services/profile/profile.service';
import { DepartmentService } from '../../../services/department/department.service';
import { User } from '../../../interfaces/user.interface';
import { Guardian } from '../../../interfaces/guardian.interface';
import { Subject } from '../../../interfaces/subject.interface';
import { Department } from '../../../interfaces/department.interface';
import { Semester, Year } from '../../../interfaces/class.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [
    ContentHeaderComponent,
    SpinnerComponent,
    ReactiveFormsModule,
    FileInputComponent,
    InputFormComponent,
    SubmitButtonComponent,
    SelectFormComponent,
    DatePipe,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  title = 'PROFILE';
  formData = signal<FormGroup | null>(null);
  guardians = signal<Guardian[]>([]);
  departments = signal<Department[]>([]);
  semesters = signal<Semester[]>([]);
  years = signal<Year[]>([]);

  readonly profile = computed<User | null>(() => this.profileService.profile());
  readonly isStudent = computed(() => this.profile()?.role === 'student');
  readonly isFacultyOrAdmin = computed(
    () => this.profile()?.role === 'faculty' || this.profile()?.role === 'admin'
  );

  private formBuilder = inject(FormBuilder);
  private global = inject(GlobalService);
  private profileService = inject(ProfileService);
  private departmentService = inject(DepartmentService);

  constructor() {}

  ngOnInit() {
    this.initForm();
    this.getProfileData();
    this.loadDepartments();
    this.loadSemesters();
    this.loadYears();
  }

  async initForm() {
    const form = this.formBuilder.group({
      name: [null, Validators.required],
      email: [
        { value: null, disabled: true },
        [Validators.required, Validators.email],
      ],
      phone: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      username: [{ value: null, disabled: true }],
      photo: [null],
      department: [null],
      semester: [null],
      year: [null],
      rollNo: [null],
      guardians: this.formBuilder.array([]),
    });

    this.formData.set(form);
  }

  async getProfileData() {
    try {
      this.global.showSpinner();
      const profile = await this.profileService.getProfile();
      console.log('profile:', profile);

      this.formData()?.patchValue({
        name: this.profile()?.name,
        email: this.profile()?.email,
        phone: this.profile()?.phone,
        username: this.profile()?.username,
        photo: this.profile()?.photo,
        department: this.profile()?.classData?.department?._id,
        semester: this.profile()?.classData?.semester,
        year: this.profile()?.classData?.year,
        rollNo: this.profile()?.rollNo,
      });

      if (this.isStudent() && this.profile()?.guardian) {
        this.loadGuardians(this.profile()?.guardian!);
      }
    } catch (e) {
      this.global.showAlert('Error!', e, 'OK');
    } finally {
      this.global.hideSpinner();
    }
  }

  onSubmit() {
    if (this.formData()?.invalid) {
      this.formData()?.markAllAsTouched();
      return;
    }

    this.updateProfile();
  }

  async updateProfile() {
    try {
      this.global.showSpinner();
      const formValue = this.formData()?.getRawValue();
      await this.profileService.updateProfile(formValue);

      this.global.showSuccess(
        'Profile updated successfully',
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

  loadGuardians(guardians: Guardian[]) {
    const guardianArray = this.guardiansArray;
    guardianArray.clear();
    guardians.forEach((guardian) => {
      guardianArray.push(this.createGuardianForm(guardian));
    });
  }

  createGuardianForm(guardian?: Guardian): FormGroup {
    return this.formBuilder.group({
      name: [guardian?.name || null, Validators.required],
      phone: [guardian?.phone || null, Validators.required],
      relation: [guardian?.relation || null, Validators.required],
    });
  }

  get guardiansArray(): FormArray {
    return this.formData()?.get('guardians') as FormArray;
  }

  addGuardian() {
    this.guardiansArray.push(this.createGuardianForm());
  }

  removeGuardian(index: number) {
    this.guardiansArray.removeAt(index);
  }

  async loadDepartments() {
    try {
      const response = await this.departmentService.getAllDepartments();
      this.departments.set(response?.data);
    } catch (err) {
      console.error(err);
    }
  }

  loadSemesters() {
    this.semesters.set([1, 2]);
  }

  loadYears() {
    this.years.set([1, 2, 3, 4]);
  }
}
