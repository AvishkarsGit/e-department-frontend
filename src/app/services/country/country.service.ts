import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Country } from '../../interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private http = inject(HttpService);
  private apiUrl = 'countries';

  constructor() { }

  async addCountry(formData: Country) {
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

  async updateCountry(id: number, formValues: Partial<Country>) {
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

  async getCountries(params: any) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl, params)
      );
      return response;
    } catch (e) {
      throw e;
    }
  }

  async getAllCountries(query?: string) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get('getCountries', query ? { query } : {})
      );
      if(!response?.success) {
        this.http.throwResponseError(response);
      }

      return response?.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteCountry(id: number) {
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