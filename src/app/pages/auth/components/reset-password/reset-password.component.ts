import { Component, inject, input, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SubmitButtonComponent } from '../../../../components/buttons/submit-button/submit-button.component';
import { GlobalService } from '../../../../services/global/global.service';
import { InputFormComponent } from '../../../../components/forms/input-form/input-form.component';
import { ResetPasswordService } from '../../../../services/reset-password/reset-password.service';
import { OtpInputComponent } from '../../../../components/forms/otp-input/otp-input.component';

interface ModelData {
  title: string;
  subTitle: string;
  button: string;
  flag: number;
}

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    SubmitButtonComponent,
    InputFormComponent,
    OtpInputComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  resetPasswordForm = signal<FormGroup | null>(null);
  // length = signal<number>(0);

  model = signal<ModelData>({
    title: '',
    subTitle: '',
    button: '',
    flag: 1,
  });

  emailVal = input<string>('');

  private formBuilder = inject(FormBuilder);
  private global = inject(GlobalService);
  private resetPasswordService = inject(ResetPasswordService);

  constructor() {}

  ngOnInit() {
    this.initForm();

    this.getResetPwdData();
  }

  initForm() {
    const form = this.formBuilder.group({
      // this.emailVal()
      email: [null, [Validators.required, Validators.email]],
      otp: [null], // No validators initially
      password: [null], // No validators initially
    });

    this.resetPasswordForm.set(form);
  }

  patchFormData(data: any) {
    this.resetPasswordForm()!.patchValue(data);
  }

  setModelData(data: ModelData) {
    this.model.set(data);
    this.updateValidations(); // Revalidate form when step changes
  }

  getFormValue() {
    return this.resetPasswordForm()!.value;
  }

  getResetPwdData() {
    let data: ModelData;
    const { email, otp } = this.getFormValue();

    if (!email && !otp) {
      data = {
        title: 'Forgot password',
        subTitle: 'Enter your email for the verification process.',
        button: 'SEND OTP',
        flag: 1,
      };
    } else if (email && !otp) {
      data = {
        title: 'Verify your Email',
        subTitle: 'Enter the verification code sent to your email.',
        button: 'VERIFY',
        flag: 2,
      };
    } else {
      data = {
        title: 'Reset password',
        subTitle: 'Enter your new password, at least 8 characters long.',
        button: 'SAVE',
        flag: 3,
      };
    }

    this.setModelData(data);
  }

  updateValidations() {
    const currentForm = this.resetPasswordForm()!; // Get the form instance
    const flag = this.model().flag;

    // Reset all fields first
    currentForm.controls['otp'].clearValidators();
    currentForm.controls['password'].clearValidators();

    if (flag === 1) {
      // Step 1: Email validation only
      currentForm.controls['email'].setValidators([
        Validators.required,
        Validators.email,
      ]);
    } else if (flag === 2) {
      // Step 2: OTP validation
      currentForm.controls['otp'].setValidators([Validators.required]);
    } else {
      // Step 3: Password validation
      currentForm.controls['password'].setValidators([
        Validators.required,
        Validators.minLength(8),
      ]);
    }

    // Update form validity
    Object.values(currentForm.controls).forEach((control) =>
      control.updateValueAndValidity()
    );

    // **Reassign updated form to the signal to trigger UI update**
    this.resetPasswordForm.set(this.formBuilder.group(currentForm.controls));
  }

  onOtpChange(otp: string) {
    this.patchFormData({ otp });
  }

  onResetPasswordSubmit() {
    if (this.resetPasswordForm()?.invalid) {
      this.global.showErrorMessage(
        'Please provide a proper email address',
        'Wrong email!',
        5000,
        false,
        'decreasing',
        'toast-bottom-center'
      );
      return;
    }

    const flag = this.model()?.flag;

    if (flag === 1) this.sendResetPasswordEmailOtp();
    else if (flag === 2) this.verifyResetPasswordOtp();
    else this.resetPassword();
  }

  async sendResetPasswordEmailOtp() {
    try {
      this.global.showSpinner();

      const email = this.getFormValue()?.email;
      await this.resetPasswordService.sendResetPasswordOtp(email);

      this.patchFormData({ email });
      this.getResetPwdData();
    } catch (e) {
      this.global.showErrorMessage(
        e,
        'Error',
        5000,
        false,
        'decreasing',
        'toast-bottom-center'
      );
    } finally {
      this.global.hideSpinner();
    }
  }

  async verifyResetPasswordOtp() {
    try {
      this.global.showSpinner();

      const data = this.getFormValue();
      await this.resetPasswordService.verifyResetPasswordOtp(
        data?.email,
        data?.otp
      );

      this.getResetPwdData();
    } catch (e) {
      this.global.showErrorMessage(
        e,
        'Error',
        5000,
        false,
        'decreasing',
        'toast-bottom-center'
      );
    } finally {
      this.global.hideSpinner();
    }
  }

  async resetPassword() {
    try {
      this.global.showSpinner();

      const data = this.getFormValue();

      await this.resetPasswordService.resetPassword(data);

      this.global.showSuccess(
        'Reset password successfully',
        null,
        5000,
        false,
        'increasing',
        'toast-top-center'
      );

      this.global.hideModal();
    } catch (e) {
      this.global.showErrorMessage(
        e,
        'Error',
        5000,
        false,
        'decreasing',
        'toast-bottom-center'
      );
    } finally {
      this.global.hideSpinner();
    }
  }
}
