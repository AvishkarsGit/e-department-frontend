import { Component, inject, input, output, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Country } from '../../../../interfaces/country.interface';
import { GlobalService } from '../../../../services/global/global.service';
import { CountryService } from '../../../../services/country/country.service';
import { SubmitButtonComponent } from '../../../../components/buttons/submit-button/submit-button.component';
import { InputFormComponent } from '../../../../components/forms/input-form/input-form.component';
// import { TextareaFormComponent } from '../../../../components/forms/textarea-form/textarea-form.component';
import { ToggleFormButtonComponent } from '../../../../components/forms/toggle-form-button/toggle-form-button.component';
import { TextEditorFormComponent } from '../../../../components/forms/text-editor-form/text-editor-form.component';

@Component({
  selector: 'app-add-country',
  imports: [
    SubmitButtonComponent,
    ReactiveFormsModule,
    InputFormComponent,
    // TextareaFormComponent,
    ToggleFormButtonComponent,
    TextEditorFormComponent,
  ],
  templateUrl: './add-country.component.html',
  styleUrl: './add-country.component.scss',
})
export class AddCountryComponent {
  formData = signal<FormGroup | null>(null);

  updateItem = input<Country>();

  added = output<Country>();
  updated = output<Country>();

  private formBuilder = inject(FormBuilder);
  private global = inject(GlobalService);
  private countryService = inject(CountryService);

  constructor() {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const item = this.updateItem();
    const form = this.formBuilder.group({
      name: [item?.name ?? null, Validators.required],
      status: [item?.status ?? false],
      remarks: [item?.remarks ?? null],
    });

    this.formData.set(form);
  }

  onSubmit() {
    if (this.formData()?.invalid) {
      console.log('submit');
      this.formData()?.markAllAsTouched();
      return;
    }

    console.log(this.formData()?.value);
    this.addCountry();
  }

  async addCountry() {
    try {
      this.global.showSpinner();

      let msg = 'added';
      let data: Country;

      const dataValue = this.formData()?.value;

      const payload = {
        ...dataValue,
        remarks: dataValue?.remarks ? JSON.stringify(dataValue?.remarks) : null,
      };

      // check if update is requested
      if (this.updateItem()) {
        // update item

        msg = 'updated';
        
        data = await this.countryService.updateCountry(
          this.updateItem()!.id,
          payload
        );
        // update records
        this.updated.emit(data);
      } else {
        data = await this.countryService.addCountry(payload);
        // update records
        this.added.emit(data);
      }
      console.log(data);

      this.global.showSuccess(
        `Country ${msg} successfully`,
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
}
