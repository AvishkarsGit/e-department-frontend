import { Component, inject, input, output, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { State } from '../../../../interfaces/state.interface';
import { GlobalService } from '../../../../services/global/global.service';
import { StateService } from '../../../../services/state/state.service';
import { SubmitButtonComponent } from '../../../../components/buttons/submit-button/submit-button.component';
import { ToggleFormButtonComponent } from '../../../../components/forms/toggle-form-button/toggle-form-button.component';
import { InputFormComponent } from '../../../../components/forms/input-form/input-form.component';
import { TextareaFormComponent } from '../../../../components/forms/textarea-form/textarea-form.component';
import { Country } from '../../../../interfaces/country.interface';
import { TypeaheadFormComponent } from "../../../../components/forms/typeahead-form/typeahead-form.component";
import { CountryService } from '../../../../services/country/country.service';

@Component({
  selector: 'app-add-state',
  imports: [
    SubmitButtonComponent,
    ToggleFormButtonComponent,
    ReactiveFormsModule,
    InputFormComponent,
    TextareaFormComponent,
    TypeaheadFormComponent
],
  templateUrl: './add-state.component.html',
  styleUrl: './add-state.component.scss',
})
export class AddStateComponent {
  formData = signal<FormGroup | null>(null);

  updateItem = input<State>();
  isCountryFetched = signal<boolean>(false);
  countries = signal<Country[]>([]);

  added = output<State>();
  updated = output<State>();


  private formBuilder = inject(FormBuilder);
  private global = inject(GlobalService);
  private stateService = inject(StateService);
  private countryService = inject(CountryService);

  constructor() {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const item = this.updateItem();
    console.log(item);
    
    const form = this.formBuilder.group({
      country_name: [item?.country_details?.name ?? null, Validators.required],
      country_id: [item?.country_id ?? null, Validators.required],
      name: [item?.name ?? null, Validators.required],
      remarks: [item?.remarks || null],
      status: [item?.status ?? false],
    });

    this.formData.set(form);
  }

  onCountryChange(query: string) {
    console.log(query);
    if (query?.trim()?.length > 0) {
      this.getCountries(query); // You already defined this function!
    }
  }

  async getCountries(query: string) {
    try {
      this.global.showSpinner();
      const countries = await this.countryService.getAllCountries(query);
      console.log(countries);
      this.countries.set(countries);
      this.isCountryFetched.set(true);
    } catch(e) {
      this.global.showErrorMessage(
        e,
        null,
        3000,
        false,
        'decreasing',
        'toast-top-center'
      );
    } finally {
      this.global.hideSpinner();
    }
  }

  updateCountry(item: Country) {
    this.formData()?.patchValue({ country_id: item.id });
    console.log(this.formData()?.value);
  }

  onSubmit() {
    if (this.formData()?.invalid) {
      console.log('submit');
      this.formData()?.markAllAsTouched();
      return;
    }

    this.addState();
  }

  async addState() {
    try {
      this.global.showSpinner();

      let msg = 'added';
      let data: State;

      // check if update is requested
      if (this.updateItem()) {
        // update item

        let msg = 'updated';

        data = await this.stateService.updateState(
          this.updateItem()!.id,
          this.formData()?.value
        );
        // update records
        this.updated.emit(data);
      } else {
        data = await this.stateService.addState(this.formData()?.value);
        // update records
        this.added.emit(data);
      }
      console.log(data);

      this.global.showSuccess(
        `State ${msg} successfully`,
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
