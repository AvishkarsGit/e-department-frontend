import { Component, input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-toggle-form-button',
  imports: [ReactiveFormsModule, MatSlideToggleModule],
  templateUrl: './toggle-form-button.component.html',
  styleUrl: './toggle-form-button.component.scss',
})
export class ToggleFormButtonComponent {
  readonly label = input<string>();
  readonly disabled = input<boolean>(false);
  readonly color = input<string>('accent');
  // readonly control = input<any>();
  
  readonly control = input<AbstractControl | null>();
  
  get controlInput(): FormControl {
    const raw = this.control();
    return raw instanceof FormControl ? raw : new FormControl();
  }
}
