import { Component, inject, output, signal } from '@angular/core';
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

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
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
        validators: [
          Validators.required,
          Validators.email
        ],
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
    console.log(this.formData()?.value);
    this.login();
  }

  login() {
    this.setIsLogin(true);
    this.auth
      .login((this.formData()?.value.email).toString(), this.formData()?.value.password)
      .then((data) => {
        console.log(data);
        if (data) {
          this.navigate();
          this.setIsLogin(false);
          this.formData()?.reset();
        } else {
          this.setIsLogin(false);
          this.global.showAlert(
            'Unauthorized User',
            'You are not an Authorized User! Please try again with proper credentials.',
            'OK',
            false
          );
        }
      })
      .catch((e) => {
        console.log(e);
        this.setIsLogin(false);
        // let msg: string = 'Could not sign you in, please try again.';
        this.global.showAlert('Error', e, 'OK');
      });
  }

  navigate() {
    this.global.navigateByUrl(Strings.HOME);
  }

  resetPassword() {
    const email = this.formData()?.value.email || '';
    this.resetPwd.emit(email);
  }
}
