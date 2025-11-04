import { Component, inject, input, output, signal } from '@angular/core';
import { Strings } from '../../../enums/strings';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GlobalService } from '../../../services/global/global.service';
import { InputFormComponent } from '../../../components/forms/input-form/input-form.component';
import { SubmitButtonComponent } from '../../../components/buttons/submit-button/submit-button.component';
import { AuthService } from '../../../services/auth/auth.service';

interface StageModel {
  title: string;
  subtitle: string;
  button: string;
  flag: number; // 1=email, 2=otp
}

@Component({
  selector: 'app-verify-email',
  imports: [ReactiveFormsModule, InputFormComponent, SubmitButtonComponent],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent {
  private fb = inject(FormBuilder);
  private global = inject(GlobalService);
  private auth = inject(AuthService);
  private isAuthenticated = this.auth.isLoggedIn();

  // --- Signals ---
  form = signal<FormGroup>(this.createForm());
  stage = signal<StageModel>({
    title: 'Verify your Email',
    subtitle: 'Enter your email to receive a verification code.',
    button: 'Send OTP',
    flag: 1,
  });

  // Timer signals
  resendDisabled = signal(false);
  resendTimer = signal(0);
  private timerInterval: any = null;

  // --- Lifecycle ---
  ngOnInit() {
    console.log('VerifyEmailComponent initialized');
  }

  // --- Form setup ---
  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: [''],
    });
  }

  get f() {
    return this.form().controls;
  }

  // --- Stage management ---
  private setStage(data: Partial<StageModel>) {
    this.stage.update((prev) => ({ ...prev, ...data }));
    this.updateValidators();
  }

  private updateValidators() {
    const flag = this.stage().flag;
    const controls = this.form().controls;

    // Reset validators
    controls['email'].clearValidators();
    controls['otp'].clearValidators();

    if (flag === 1) {
      controls['email'].setValidators([Validators.required, Validators.email]);
    } else if (flag === 2) {
      controls['otp'].setValidators([
        Validators.required,
        Validators.minLength(6),
      ]);
    }

    Object.values(controls).forEach((c) => c.updateValueAndValidity());
  }

  // --- Submission ---
  async onSubmit() {
    if (this.form().invalid) {
      this.global.showErrorMessage(
        'Please fill out all required fields correctly.',
        'Error',
        5000,
        false,
        'decreasing',
        'toast-bottom-center'
      );
      return;
    }

    const { flag } = this.stage();
    if (flag === 1) {
      await this.sendOtp();
    } else if (flag === 2) {
      await this.verifyOtp();
    }
  }

  // --- API Logic ---
  private async sendOtp() {
    try {
      this.global.showSpinner();

      const { email } = this.form().value;
      //send otp
      await this.auth.sendOtp(email);
      this.setStage({
        title: 'Enter Verification Code',
        subtitle: 'We’ve sent a 6-digit code to your email.',
        button: 'Verify OTP',
        flag: 2,
      });

      this.startResendTimer(30); // ⏳ start 30s countdown

      this.global.showSuccess(
        'OTP sent successfully!',
        'Check your inbox',
        5000,
        false,
        'decreasing',
        'toast-top-center'
      );
    } catch (e) {
      this.global.showErrorMessage(
        e,
        'Error sending OTP',
        5000,
        false,
        'decreasing',
        'toast-bottom-center'
      );
    } finally {
      this.global.hideSpinner();
    }
  }

  private async verifyOtp() {
    try {
      this.global.showSpinner();

      const { email, otp } = this.form().value;
      console.log('Verifying OTP for', email, 'OTP:', otp);

      await this.auth.verifyEmail(email, otp);
      this.global.showSuccess(
        'Email verified successfully!,Login to continue.',
        'Success',
        5000,
        false,
        'decreasing',
        'toast-top-center'
      );
      this.global.hideModal();
      //navigate to login if user is not authenticated
      if (!this.isAuthenticated) {
        this.auth.navigateByUrl(Strings.LOGIN);
      } else {
        this.auth.navigateByUrl(Strings.HOME);
      }
    } catch (e) {
      this.global.showErrorMessage(
        e,
        'Invalid or expired OTP',
        5000,
        false,
        'decreasing',
        'toast-bottom-center'
      );
    } finally {
      this.global.hideSpinner();
    }
  }

  // --- Timer Logic ---
  private startResendTimer(seconds: number) {
    this.clearTimer();
    this.resendDisabled.set(true);
    this.resendTimer.set(seconds);

    this.timerInterval = setInterval(() => {
      const remaining = this.resendTimer() - 1;
      if (remaining <= 0) {
        this.clearTimer();
      } else {
        this.resendTimer.set(remaining);
      }
    }, 1000);
  }

  private clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.resendDisabled.set(false);
    this.resendTimer.set(0);
  }

  onResendClick() {
    if (this.resendDisabled()) return;
    this.sendOtp();
  }

  ngOnDestroy() {
    this.clearTimer();
  }
}
