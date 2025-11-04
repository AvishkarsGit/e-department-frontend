import { NgStyle } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';;

@Component({
  selector: 'app-checkbox',
  imports: [NgStyle],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent {
  // Inputs
  readonly label = input<string>();
  readonly items = input<any[]>([]);
  readonly optionValueField = input<string>('id');
  readonly optionTextField = input<string>('name');
  readonly control = input<AbstractControl | null>();
  readonly required = input<boolean>(false);
  readonly scrollable = input<boolean>(false);
  readonly height = input<string>('200px');
  readonly noMarginBottom = input<boolean>(false);
  readonly key = input<number>();

  // Output
  onChange = output<any[]>();

  get controlArray(): FormArray<FormControl<any>> {
    const raw = this.control();
    return raw instanceof FormArray
      ? (raw as FormArray<FormControl<any>>)
      : new FormArray<FormControl<any>>([]);
  }

  toggleSelection(value: any, checked: boolean) {
    const formArray = this.controlArray;
    const index = formArray.value.indexOf(value);

    if (checked && index === -1) {
      // Add only if not already present
      formArray.push(new FormControl<any>(value));
    } else if (!checked && index !== -1) {
      // Remove if it was unchecked
      formArray.removeAt(index);
    }
    // ensure unique values only
    const uniqueValues = Array.from(new Set(formArray.value));
    // Emit only final checked values (always latest state)
    this.onChange.emit(uniqueValues);
  }

  isChecked(value: any): boolean {
    return this.controlArray.value.includes(value);
  }

  onCheckboxChange(event: Event, item: any) {
    const input = event.target as HTMLInputElement;
    const value = item[this.optionValueField()];
    this.toggleSelection(value, input.checked);
  }

  reset() {
    const formArray = this.controlArray;
    formArray.clear();

    // Force uncheck all UI checkboxes
    setTimeout(() => {
      const checkboxes = document.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]'
      );
      checkboxes.forEach((cb) => (cb.checked = false));
    });

    this.onChange.emit([]);
  }
}
