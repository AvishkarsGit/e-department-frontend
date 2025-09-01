import { Component, input, output } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxSelectModule } from 'ngx-select-ex';

@Component({
  selector: 'app-select-form',
  imports: [ReactiveFormsModule, NgxSelectModule],
  templateUrl: './select-form.component.html',
  styleUrl: './select-form.component.scss',
})
export class SelectFormComponent {
  readonly label = input<string>();
  readonly items = input<any[]>([]);
  readonly noMarginBottom = input<boolean>(false);
  readonly optionValueField = input<any>();
  readonly optionTextField = input<string>();
  readonly required = input<boolean>(true);
  readonly placeholder = input<string>('Select');
  // readonly disabled = input<boolean>(false);
  readonly multiple = input<boolean>(false);
  readonly size = input<"small" | "default" | "large">('default');
  readonly option_value = input<any>();
  readonly append_string = input<string>();
  // readonly control = input<any>();

  readonly control = input<AbstractControl | null>();
  
  get controlInput(): FormControl {
    const raw = this.control();
    return raw instanceof FormControl ? raw : new FormControl();
  }
  
  onChange = output<any>();

  onSelectionChange(event: any) {
    this.onChange.emit(event[0]?.data);
  }
}
