import { Component, computed, inject, input, signal } from '@angular/core';
import { ContentHeaderComponent } from '../../../components/content-header/content-header.component';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FileInputComponent } from '../../../components/forms/file-input/file-input.component';
import { InputFormComponent } from '../../../components/forms/input-form/input-form.component';
import { SubmitButtonComponent } from '../../../components/buttons/submit-button/submit-button.component';
import { GlobalService } from '../../../services/global/global.service';
import { ProfileService } from '../../../services/profile/profile.service';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-profile',
  imports: [
    ContentHeaderComponent,
    SpinnerComponent,
    ReactiveFormsModule,
    FileInputComponent,
    InputFormComponent,
    SubmitButtonComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  title = 'PROFILE';
  formData = signal<FormGroup | null>(null);

  readonly profile = computed<User | null>(() => this.profileService.profile());

  private formBuilder = inject(FormBuilder);
  private global = inject(GlobalService);
  private profileService = inject(ProfileService);

  constructor() {}

  ngOnInit() {
    this.initForm();
    this.getProfileData();
  }

  async initForm() {
    const form = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phone: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      password: [
        null,
        [Validators.minLength(8)].filter(Boolean), // Removes `null` values
      ],
      photo: [null],
    });

    this.formData.set(form);
  }

  async getProfileData() {
    try {
      this.global.showSpinner();
      await this.profileService.getProfile();

      this.formData()?.patchValue({
        name: this.profile()?.name,
        email: this.profile()?.email,
        phone: this.profile()?.phone,
        // photo: this.profile()?.photo,
      });
    } catch (e) {
      console.log(e);
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

      await this.profileService.updateProfile(this.formData()?.value);

      this.global.showSuccess(
        'Profile updated successfully',
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
