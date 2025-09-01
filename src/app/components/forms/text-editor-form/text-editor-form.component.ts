import { Component, input } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-text-editor-form',
  imports: [ReactiveFormsModule, NgxEditorModule],
  templateUrl: './text-editor-form.component.html',
  styleUrl: './text-editor-form.component.scss',
})
export class TextEditorFormComponent {
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  readonly label = input<string>();
  readonly required = input<boolean>(true);
  readonly rows = input<number>(1);
  // readonly formControlName = input<any>();
  readonly placeholder = input<string>();
  readonly readOnly = input<boolean>(false);

  // readonly control = input<FormControl>();

  // Now accepts AbstractControl
  readonly control = input<AbstractControl | null>();

  get controlInput(): FormControl {
    const raw = this.control();
    return raw instanceof FormControl ? raw : new FormControl();
  }

  ngOnInit(): void {
    this.editor = new Editor();

    const control = this.controlInput;

    // Parse initial value
    const parsed = this.safeParse(control.value);
    if (parsed !== null && parsed !== control.value) {
      control.setValue(parsed, { emitEvent: false });
    }

    // If required, apply the custom validator dynamically
    if (this.required()) {
      control.addValidators(this.emptyEditorValidator.bind(this));
      control.updateValueAndValidity();
    }

    // Watch for changes
    control.valueChanges.subscribe((val) => {
      if (typeof val !== 'string') {
        const str = this.safeStringify(val);
        if (str !== control.value) {
          control.setValue(val, { emitEvent: false });
        }
      }
    });
  }

  private emptyEditorValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value;

    if (
      !value ||
      typeof value !== 'object' ||
      !value.content ||
      value.content.length === 0
    ) {
      return { required: true };
    }

    const hasText = value.content.some((block: any) =>
      block.content?.some((child: any) => !!child.text?.trim())
    );

    return hasText ? null : { required: true };
  }

  private safeParse(value: any): any {
    console.log(value);
    try {
      return typeof value == 'string' ? JSON.parse(value) : value;
    } catch (e) {
      console.warn('Invalid JSON in remarks:', typeof value);
      return null;
    }
  }

  private safeStringify(value: any): string {
    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
