import { Component, inject, input, output, signal } from '@angular/core';
import { SubmitButtonComponent } from '../../../../components/buttons/submit-button/submit-button.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GlobalService } from '../../../../services/global/global.service';
import { SubjectService } from '../../../../services/subject/subject.service';
import { Subject } from '../../../../interfaces/subject.interface';
import { InputFormComponent } from '../../../../components/forms/input-form/input-form.component';
import { SelectFormComponent } from '../../../../components/forms/select-form/select-form.component';
import { FileInputComponent } from '../../../../components/forms/file-input/file-input.component';
import { Upload } from '../../../../interfaces/upload.interface';
import { UploadService } from '../../../../services/uploads/upload.service';

interface UploadType {
  label: string;
  value: string;
}

@Component({
  selector: 'app-add-study-material',
  imports: [
    SubmitButtonComponent,
    InputFormComponent,
    ReactiveFormsModule,
    SelectFormComponent,
    FileInputComponent,
  ],
  templateUrl: './add-study-material.component.html',
  styleUrl: './add-study-material.component.scss',
})
export class AddStudyMaterialComponent {
  formData = signal<FormGroup | null>(null);

  //signals
  subjects = signal<Subject[]>([]);
  uploadTypes = signal<UploadType[]>([]);

  //input signals
  updateItem = input<Upload>();

  //output signals
  added = output<Upload>();
  updated = output<Upload>();

  private formBuilder = inject(FormBuilder);
  private global = inject(GlobalService);
  private uploadService = inject(UploadService);
  private subjectService = inject(SubjectService);

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    //load subjects and upload types
    this.loadSubjectsAndUploads();
    console.log('updated item:', this.updateItem());
  }

  initForm() {
    const item = this.updateItem();
    const form = this.formBuilder.group({
      title: [item?.title ?? null, Validators.required],
      upload_type: [item?.upload_type ?? null, Validators.required],
      subject_id: [item?._id ?? null, Validators.required],
      uploaded_url: [item?.uploaded_url ?? null],
    });

    this.formData.set(form);
  }

  onSubmit() {
    if (this.formData()?.invalid) {
      console.log('submit');
      this.formData()?.markAllAsTouched();
      return;
    }

    this.addMaterial();
  }

  async addMaterial() {
    try {
      this.global.showSpinner();
      let msg = 'added';
      let data: Upload;

      const dataValue = this.formData()?.value;

      // check if update is requested
      if (this.updateItem()) {
        // update item

        msg = 'updated';

        // const response = await this.subjectService.updateSubject(
        //   this.updateItem()!._id,
        //   {
        //     name: dataValue.name.trim(),
        //     code: dataValue.code.trim(),
        //     class_id: classId,
        //   }
        // );

        // const result = response?.data;
        // data = {
        //   _id: result?.subject?._id,
        //   name: result?.subject?.name,
        //   code: result?.subject?.code,
        //   class_id: result?.subject?.class_id,
        //   classData: result?.classData,
        // };
        // //  update records
        // this.updated.emit(data);
      } else {
        const payload = {
          title: dataValue.title,
          upload_type: dataValue.upload_type,
          subject_id: dataValue.subject_id,
          uploaded_url: dataValue.uploaded_url,
        };
        const response = await this.uploadService.uploadMaterial(payload);
        this.added.emit(response?.data);
      }

      this.global.showSuccess(
        `Material ${msg} successfully`,
        null,
        5000,
        false,
        'increasing',
        'toast-top-center'
      );

      this.global.hideModal();
    } catch (e) {
      console.log(e);
      this.global.showAlert('Error!', e, 'OK');
    } finally {
      this.global.hideSpinner();
    }
  }

  async loadSubjectsAndUploads() {
    try {
      const response = await this.subjectService.getAllSubjects();
      this.subjects.set(response?.data);
      const upload_types = [
        {
          label: 'Lab Manual',
          value: 'lab_manual',
        },
        {
          label: 'Syllabus',
          value: 'syllabus',
        },
        {
          label: 'Time Table',
          value: 'time_table',
        },
        {
          label: 'Assignment',
          value: 'assignment',
        },
        {
          label: 'Notice',
          value: 'notice',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ];
      this.uploadTypes.set(upload_types);
    } catch (err) {
      console.error(err);
    }
  }
}
