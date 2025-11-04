import { Component, inject, input, output, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SubmitButtonComponent } from '../../../../components/buttons/submit-button/submit-button.component';
import { GlobalService } from '../../../../services/global/global.service';
import { SelectFormComponent } from '../../../../components/forms/select-form/select-form.component';
import { SubjectService } from '../../../../services/subject/subject.service';
import { Faculty } from '../../../../interfaces/faculty.interface';
import { FacultyService } from '../../../../services/faculty/faculty.service';
import { Subject } from '../../../../interfaces/subject.interface';
import { User } from '../../../../interfaces/user.interface';
import { ProfileService } from '../../../../services/profile/profile.service';

@Component({
  selector: 'app-add-faculties',
  imports: [ReactiveFormsModule, SubmitButtonComponent, SelectFormComponent],
  templateUrl: './add-faculties.component.html',
  styleUrl: './add-faculties.component.scss',
})
export class AddFacultiesComponent {
  formData = signal<FormGroup | null>(null);
  updateItem = input<Faculty>();
  subjects = signal<Subject[]>([]);
  updated = output<Faculty>();

  private formBuilder = inject(FormBuilder);
  private global = inject(GlobalService);
  private facultyService = inject(FacultyService);
  private subjectService = inject(SubjectService);
  private profileService = inject(ProfileService);

  ngOnInit() {
    this.initForm();
    this.loadSubjects();
  }

  initForm() {
    const item = this.updateItem();
    const form = this.formBuilder.group({
      subjects: this.formBuilder.array(
        item?.subjects?.map((s) => this.createSubjectForm(s)) || []
      ),
    });
    this.formData.set(form);
  }

  onSubmit() {
    if (this.formData()?.invalid) {
      this.formData()?.markAllAsTouched();
      return;
    }
    this.assignSubjects();
  }

  async loadSubjects() {
    try {
      const response = await this.subjectService.getAllSubjects();
      this.subjects.set(response?.data);
    } catch (err) {
      console.error(err);
    }
  }

  createSubjectForm(subject?: Subject): FormGroup {
    return this.formBuilder.group({
      subject: [subject?._id || null, Validators.required],
    });
  }

  get subjectsArray(): FormArray {
    return this.formData()?.get('subjects') as FormArray;
  }

  addSubject() {
    this.subjectsArray.push(this.createSubjectForm());
  }

  removeSubject(index: number) {
    this.subjectsArray.removeAt(index);
  }

  async assignSubjects() {
    this.global.showSpinner();
    try {
      const data = {
        faculty: this.updateItem()?._id,
        subjects: JSON.stringify(this.formData()?.value.subjects),
      };

      const response = await this.facultyService.assignSubjects(data);

      this.updated.emit(response?.data);
      this.global.showSuccess(
        'Subjects assigned successfully',
        null,
        5000,
        false,
        'increasing',
        'toast-top-center'
      );

      this.resetAssignSubjectsForm(response?.data?.subjects);
    } catch (error) {
      this.global.showAlert('Error!', error, 'Ok');
    } finally {
      this.global.hideSpinner();
    }
  }

  async resetAssignSubjectsForm(subjects: Subject[]) {
    const updateItem = this.updateItem();
    if (!updateItem || !updateItem.user) return;
    if (updateItem?.user?.role === 'admin') {
      const { _id, user } = updateItem;
      const data: User = {
        ...user,
        _id,
        subjects,
      };
      this.profileService.setProfile(data);
    }
  }
}
