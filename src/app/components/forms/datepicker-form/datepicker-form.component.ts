import { Component, input } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-datepicker-form',
  imports: [ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './datepicker-form.component.html',
  styleUrl: './datepicker-form.component.scss',
})
export class DatepickerFormComponent {
  readonly label = input<string>();
  readonly icon = input<string>();
  readonly required = input<boolean>(true);
  // readonly formControlName = input<any>();
  readonly placeholder = input<string>();

  // readonly control = input<any>();
  readonly control = input<AbstractControl | null>();

  get controlInput(): FormControl {
    const raw = this.control();
    return raw instanceof FormControl ? raw : new FormControl();
  }

  datePickerConfig: Partial<BsDatepickerConfig> = Object.assign(
    {},
    {
      containerClass: 'theme-dark-blue',
      // showWeekNumbers: true,
      // minDate: new Date(2018, 0, 1),
      // maxDate: new Date(2018, 11, 31),
      // dateInputFormat: 'YYYY-MM-DD'
      dateInputFormat: 'YYYY-MM-DD',
      adaptivePosition: true,
      isAnimated: false,
    }
  );

}
