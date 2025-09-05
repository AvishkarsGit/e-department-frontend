import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Class } from '../../interfaces/class.interface';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private http = inject(HttpService);
  private apiUrl = 'class';

  constructor() {}

  async getClasses(params: any) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/classes', params)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response;
    } catch (e) {
      throw e;
    }
  }

  async updateClass(id: string, formValues: Partial<Class>) {
    try {
      let isFormData = false;

      console.log(formValues);

      // Clean the JSON data before processing
      let updatedFormValues = this.http.cleanFormValues(formValues);

      const response = await this.http.lastValueFrom(
        this.http.patch(
          `${this.apiUrl}/update/${id}`,
          updatedFormValues,
          isFormData
        )
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response?.data;
    } catch (e) {
      throw e;
    }
  }

  async addClass(formData: Class) {
    try {
      let formValues: any = formData;
      let isFormData = false;

      const response = await this.http.lastValueFrom(
        this.http.post(`${this.apiUrl}/add`, formValues, isFormData)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response?.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteDepartment(id: string) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.delete(this.apiUrl + '/delete/' + id)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }
    } catch (error) {
      throw error;
    }
  }
}
