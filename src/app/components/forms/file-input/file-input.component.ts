import { Component, OnInit, input, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Strings } from '../../../enums/strings';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  imports: [ReactiveFormsModule, MatButtonModule],
})
export class FileInputComponent implements OnInit {
  defaultImage = Strings.DEFAULT_SELECT_IMAGE;

  // selectedFile = signal<File | File[] | null>(null);

  label = input<string>();
  required = input<boolean>(true);
  isOnlyImage = input<boolean>(false);
  multiple = input<boolean>(false);

  previewUrls = signal<string[] | null>(null);
  isError = signal<string | null>(null);

  // control = input<any>(); // Bind ReactiveForm control

  readonly control = input<AbstractControl | null>();

  get controlInput(): FormControl | null {
    const raw = this.control();
    return raw instanceof FormControl ? raw : new FormControl();
  }

  constructor() {}

  ngOnInit() {}

  setPreviewUrls(urls: string[]) {
    this.previewUrls.set(urls);
  }

  setIsError(value: string | null) {
    this.isError.set(value);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const previewUrls: string[] = [];

    Array.from(files).forEach((file) => {
      console.log(file);

      if (file.size > 2 * 1024 * 1024) {
        console.log('size error: ', file.size);
        this.controlInput?.setErrors({ maxSize: true });
        this.setIsError('* File size exceeds limit');
        return;
      }

      if (
        this.isOnlyImage() &&
        !['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)
      ) {
        console.log('type error: ', file.type);
        this.controlInput?.setErrors({ invalidType: true });
        this.setIsError('* Invalid file type');
        return;
      }

      this.setIsError(null);

      validFiles.push(file);
      previewUrls.push(URL.createObjectURL(file));
      console.log('preview urls: ', previewUrls);
    });

    if (validFiles.length === 0) return;

    // Set form control value
    this.controlInput?.setValue(this.multiple() ? validFiles : validFiles[0]);
    this.controlInput?.markAsTouched();

    // Set preview URLs
    this.setPreviewUrls(previewUrls);
    console.log('final preview urls: ', previewUrls);
  }

  // onFileSelected(event: any) {
  //   const file = event.target.files[0];

  //   if (file) {
  //     // Custom validation: Max size 2MB, only images
  //     if (file.size > 2 * 1024 * 1024) {
  //       this.controlInput?.setErrors({ maxSize: true });
  //       return;
  //     }

  //     if (
  //       this.isOnlyImage() &&
  //       !['image/png', 'image/jpg', 'image/jpg'].includes(file.type)
  //     ) {
  //       this.controlInput?.setErrors({ invalidType: true });
  //       return;
  //     }

  //     // ✅ Set the object URL for preview
  //     this.setUrl(URL.createObjectURL(file));

  //     // ✅ Store the file object inside the form control
  //     this.controlInput?.setValue(file);
  //     this.controlInput?.markAsTouched();
  //   }
  // }

  resetPreview(index: number) {
    const urls = this.previewUrls()!;
    urls.splice(index, 1);
    this.previewUrls.set([...urls]);
  }
}
