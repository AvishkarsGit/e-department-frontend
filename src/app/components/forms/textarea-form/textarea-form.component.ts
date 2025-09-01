import { Component, input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea-form',
  imports: [ReactiveFormsModule],
  templateUrl: './textarea-form.component.html',
  styleUrl: './textarea-form.component.scss',
})
export class TextareaFormComponent {

  readonly label = input<string>();
  readonly required = input<boolean>(true);
  readonly rows = input<number>(1);
  // readonly formControlName = input<any>();
  readonly placeholder = input<string>();
  readonly readOnly = input<boolean>(false);
  // readonly control = input<any>();
  
  readonly control = input<AbstractControl | null>();
  
  get controlInput(): FormControl {
    const raw = this.control();
    return raw instanceof FormControl ? raw : new FormControl();
  }
}
