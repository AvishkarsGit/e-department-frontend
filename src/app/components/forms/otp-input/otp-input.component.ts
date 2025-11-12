import { Component, input, output } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';

@Component({
  selector: 'app-otp-input',
  imports: [ReactiveFormsModule, NgOtpInputModule],
  templateUrl: './otp-input.component.html',
  styleUrl: './otp-input.component.scss',
})
export class OtpInputComponent {
  config = {
    length: 6,
    allowNumbersOnly: true,
    inputClass: 'otp-input-style',
  };
  otp = output<any>();
  // length = output<number>();
  // readonly control = input<any>();

  readonly control = input<AbstractControl | null>();

  get controlInput(): FormControl {
    const raw = this.control();
    return raw instanceof FormControl ? raw : new FormControl();
  }

  constructor() {}

  ngOnInit() {
    // this.length.emit(this.config.length);
  }

  // onOtpChange(otp: any) {
  //   this.otp.emit(otp);
  // }
}
