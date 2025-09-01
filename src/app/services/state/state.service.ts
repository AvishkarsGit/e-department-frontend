import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { State } from '../../interfaces/state.interface';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private http = inject(HttpService);
  private apiUrl = 'states';

  constructor() { }

  async addState(formData: State) {
    try {
      // Clean the JSON data before processing
      formData = this.http.cleanFormValues(formData);

      const response = await this.http.lastValueFrom(
        this.http.post(this.apiUrl, formData)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response?.data;
    } catch (e) {
      throw e;
    }
  }

  async updateState(id: number, formValues: Partial<State>) {
    try {
      let isFormData = false;

      console.log(formValues);

      // Clean the JSON data before processing
      formValues = this.http.cleanFormValues(formValues);

      console.log(formValues);

      const response = await this.http.lastValueFrom(
        this.http.post(`${this.apiUrl}/${id}`, formValues, isFormData)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response?.data;
    } catch (e) {
      throw e;
    }
  }

  async getStates(params: any) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl, params)
      );
      return response;
    } catch (e) {
      throw e;
    }
  }

  async getCountryStates(country_id: number) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get('getStates', { country_id })
      );
      console.log(response);

      if(!response?.success) {
        this.http.throwResponseError(response);
      }

      return response?.data;
    } catch (e) {
      throw e;
    }
  }

  async getAllStates() {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get('getStates')
      );
      console.log(response);

      if(!response?.success) {
        this.http.throwResponseError(response);
      }

      return response?.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteState(id: number) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.delete(`${this.apiUrl}/${id}`)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response?.data;
    } catch (e) {
      throw e;
    }
  }
}