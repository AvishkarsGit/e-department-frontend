import {
  Component,
  inject,
  output,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../services/auth/auth.service';
import { GlobalService } from '../../../../services/global/global.service';
import { Strings } from '../../../../enums/strings';
import { VerifyEmailComponent } from '../../verify-email/verify-email.component';

@Component({
  selector: 'app-signin',
  imports: [
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    VerifyEmailComponent,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  @ViewChild('emailVerificationTemplate')
  emailVerificationTemplate!: TemplateRef<any>;
  formData = signal<FormGroup | null>(null);
  isLogin = signal<boolean>(false);

  resetPwd = output<string>();

  public global = inject(GlobalService);
  public auth = inject(AuthService);

  constructor() {
    this.initForm();
  }

  setIsLogin(value: boolean) {
    this.isLogin.set(value);
  }

  initForm() {
    const form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });

    this.formData.set(form);
  }

  onSubmit() {
    if (this.formData()?.invalid) {
      this.formData()?.markAllAsTouched();
      return;
    }

    this.login();
  }

  async login() {
    if (!this.formData()) return;
    const email = this.formData()?.value.email;
    const password = this.formData()?.value.password;
    this.setIsLogin(true);
    try {
      // Step 1: Check user status
      const userStatus = await this.auth.checkUser(email);
      
      if (!userStatus?.data?.exists) {
        this.global.showAlert(
          'Account Not Found',
          'No account found with this email address.',
          'OK',
          false
        );
        this.setIsLogin(false);
        return;
      }

      // Step 2: If exists but not verified, show verify modal
      if (userStatus?.data?.user?.email_verified === 'false') {
        this.setIsLogin(false);
        this.global.showWarning(
          'Email Not Verified',
          'Please verify your email to continue.',
          4000,
          false,
          'decreasing',
          'toast-top-center'
        );
        this.global.showModal(this.emailVerificationTemplate, true);
        return;
      }

      // Step 3: If verified, proceed to normal login

      const data = await this.auth.login(email, password);
      if (data) {
        this.navigate();
        this.formData()?.reset();
      } else {
        this.global.showAlert(
          'Unauthorized User',
          'Invalid credentials. Please try again.',
          'OK',
          false
        );
      }
    } catch (e) {
      console.error(e);
      this.global.showAlert('Error', e, 'OK');
    } finally {
      this.setIsLogin(false);
    }
  }

  navigate() {
    this.global.navigateByUrl(Strings.HOME);
  }

  resetPassword() {
    const email = this.formData()?.value.email || '';
    this.resetPwd.emit(email);
  }
}
