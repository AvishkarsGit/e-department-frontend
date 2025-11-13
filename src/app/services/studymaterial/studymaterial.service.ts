import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class StudymaterialService {
  private apiUrl = 'studymaterial';
  private http = inject(HttpService);

  async addStudyMaterial(data: any) {
    try {
      let formValues: any = data;
      let isFormData = false;

      if (formValues?.file) {
        formValues = this.http.convertToFormData(formValues);
        isFormData = true;
      }

      const response = await this.http.lastValueFrom(
        this.http.post(`${this.apiUrl}/create-studymaterial`, formValues, isFormData)
      )

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response?.data;

    } catch (e) {
      throw e;
    }
  }

  async getStudyMaterial(params: any) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/get-studymaterial', params)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response;
    } catch (e) {
      throw e;
    }
  }

  async updateStudyMaterial(id: string, data: any) {
    try {
      let formValues: any = data;
      let isFormData = false;

      // Check if photo is selected (File type)
      if (formValues?.file) {
        formValues = this.http.convertToFormData(formValues);
        isFormData = true;
      }

      const response = await this.http.lastValueFrom(
        this.http.patch(
          `${this.apiUrl}/update-studymaterial/${id}`,
          formValues,
          isFormData
        )
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }
    } catch (e) {
      throw e;
    }
  }

  async deleteStudyMaterial(id: string) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.delete(`${this.apiUrl}/delete-studymaterial/${id}`)
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
