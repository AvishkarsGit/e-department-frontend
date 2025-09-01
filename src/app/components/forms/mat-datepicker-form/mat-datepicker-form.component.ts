import { Component, input } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-mat-datepicker-form',
  imports: [MatDatepickerModule, ReactiveFormsModule],
  templateUrl: './mat-datepicker-form.component.html',
  styleUrl: './mat-datepicker-form.component.scss',
})
export class MatDatepickerFormComponent {
  readonly label = input<string>();
  readonly required = input<boolean>(true);
  readonly placeholder = input<string>();

  readonly control = input<AbstractControl | null>();

  get controlInput(): FormControl {
    const raw = this.control();
    return raw instanceof FormControl ? raw : new FormControl();
  }
}
