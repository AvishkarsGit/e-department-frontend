import { UserService } from '../../services/user/user.service';
import {
  Component,
  inject,
  output,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '../../services/global/global.service';
import { AuthService } from '../../services/auth/auth.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { Strings } from '../../enums/strings';
import { SigninComponent } from './components/signin/signin.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AddUserComponent } from '../main-app/users/add-user/add-user.component';
import { User } from '../../interfaces/user.interface';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { AddStudentComponent } from "../main-app/students/add-student/add-student.component";

@Component({
  selector: 'app-auth',
  imports: [
    SpinnerComponent,
    FormsModule,
    SigninComponent,
    ResetPasswordComponent,
    AddUserComponent,
    VerifyEmailComponent,
    AddStudentComponent
],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  @ViewChild('emailVerificationTemplate')
  emailVerificationTemplate!: TemplateRef<any>;
  type = signal<boolean>(true);
  isSignup = signal<boolean>(true);
  isAdmin = signal<boolean>(false);
  email_value = signal<string>('');
  email = output<string>();


  public global = inject(GlobalService);
  public auth = inject(AuthService);
  private userService = inject(UserService);

  ngOnInit() {
    console.log('auth onInit');
  }

  setIsSignup(value: boolean) {
    this.isSignup.set(value);
  }

  async checkAdminExists(template?: any) {
    try {
      // this.global.showSpinner();
      const isAdminExists = await this.userService.checkAdminExists();

      this.setIsSignup(!isAdminExists);

      if (!this.isSignup()) {
        this.global.hideSpinner();

        this.global.showAlert(
          'Unauthorized Access!',
          'You are not authorized to signup without Administrator permission. Kindly contact admin.',
          'OK',
          false
        );

        return;
      }

      this.global.showModal(template);
    } catch (e) {
      console.log(e);
    } finally {
      this.global.hideSpinner();
    }
  }

  changeType() {
    this.type.set(!this.type());
  }

  navigate() {
    this.global.navigateByUrl(Strings.HOME);
  }

  errorMessage(msg: string) {
    this.global.showErrorMessage(
      msg,
      'Error!',
      5000,
      false,
      'decreasing',
      'toast-bottom-center'
    );
  }

  signupModal(template: any, isAdmin = false) {
    if (isAdmin) {
      this.checkAdminExists(template);
      this.isAdmin.set(true);
      return;
    }
    this.isAdmin.set(false);
    this.global.showModal(template);
  }

  async onSignupSubmit(formData: User) {
    try {
      this.global.showSpinner();
      this.isAdmin() ? (formData.role = 'admin') : (formData.role = 'faculty');
      await this.auth.register(formData);
      this.global.hideModal();
      this.global.hideSpinner();

      //open email verification modal
     this.openVerificationModal();
    } catch (e) {
      this.global.hideSpinner();
      // let msg: string = 'Could not sign you up, please try again.';
      this.global.showAlert('Error!', e, 'OK');
    }
  }

  resetPassword(email: string, template: any) {
    this.email_value.set(email);
    this.global.showModal(template);
  }

  openVerificationModal() {
    this.global.showModal(this.emailVerificationTemplate, true);
  }
}
