import { UserService } from '../../services/user/user.service';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '../../services/global/global.service';
import { AuthService } from '../../services/auth/auth.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { Strings } from '../../enums/strings';
import { SigninComponent } from './components/signin/signin.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AddUserComponent } from '../main-app/users/add-user/add-user.component';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-auth',
  imports: [
    SpinnerComponent,
    FormsModule,
    SigninComponent,
    ResetPasswordComponent,
    AddUserComponent,
],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  type = signal<boolean>(true);
  isSignup = signal<boolean>(true);
  email_value = signal<string>('');

  public global = inject(GlobalService);
  public auth = inject(AuthService);
  private userService = inject(UserService);

  ngOnInit() {
    console.log('auth oninit');
  }

  setIsSignup(value: boolean) {
    this.isSignup.set(value);
  }

  async checkAdminExists(template?: any) {
    try {
      // this.global.showSpinner();
      const isAdminExists = await this.userService.checkAdminExists();
      console.log('isAdminExists: ', isAdminExists);
      this.setIsSignup(!isAdminExists);

      // if (!this.isSignup()) {
      //   this.global.hideSpinner();

      //   this.global.showAlert(
      //     'Unauthorized Access!',
      //     'You are not authorised to signup without Administrator permission. Kindly contact admin.',
      //     'OK',
      //     false
      //   );

      //   return;
      // }

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

  signupModal(template: any) {
    this.checkAdminExists(template);
  }

  async onSignupSubmit(formData: User) {
    try {
      this.global.showSpinner();
      await this.auth.register(formData);
      this.global.hideModal();
      this.global.hideSpinner();
      this.navigate();
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
}
