import { Component, input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-form',
  imports: [ReactiveFormsModule],
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.scss'
})
export class InputFormComponent {

  readonly label = input<string>();
  readonly type = input<string>('text');
  readonly icon = input<string>();
  readonly endText = input<string>();
  readonly required = input<boolean>(true);
  readonly disabled = input<boolean>(false);
  // readonly formControlName = input<any>();
  // readonly control = input<any>();
  readonly placeholder = input<string>();
  readonly minlength = input<number>();
  readonly maxlength = input<number>();

  readonly control = input<AbstractControl | null>();

  get controlInput(): FormControl {
    const raw = this.control();
    return raw instanceof FormControl ? raw : new FormControl();
  }

}
