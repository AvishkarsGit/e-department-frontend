import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Faculty } from '../../interfaces/faculty.interface';

@Injectable({
  providedIn: 'root',
})
export class FacultyService {
  private apiUrl = 'faculty';
  private http = inject(HttpService);

  async addFaculty(data: any) {
    try {
      let formValues: any = data;
      let isFormData = false;

      // Check if photo is selected (File type)
      if (formValues?.photo instanceof File) {
        formValues = this.http.convertToFormData(formValues);
        isFormData = true;
      }

      const response = await this.http.lastValueFrom(
        this.http.post(`${this.apiUrl}/create-faculty`, formValues, isFormData)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response?.data;
    } catch (e) {
      throw e;
    }
  }

  async getFaculty(params: any) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/get-faculty', params)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response;
    } catch (e) {
      throw e;
    }
  }

  async updateFaculty(id: string, user_id: string, data: any) {
    try {
      let formValues: any = data;
      let isFormData = false;

      // Check if photo is selected (File type)
      if (formValues?.photo instanceof File) {
        formValues = this.http.convertToFormData(formValues);
        isFormData = true;
      }

      const response = await this.http.lastValueFrom(
        this.http.patch(
          `${this.apiUrl}/update-faculty/${user_id}/${id}`,
          formValues,
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

  async deleteFaculty(id: string, user_id: string) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.delete(`${this.apiUrl}/delete-faculty/${user_id}/${id}`)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response?.data;
    } catch (e) {
      throw e;
    }
  }

  async getAllFaculties() {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/get-all-faculty')
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response;
    } catch (e) {
      throw e;
    }
  }

  async assignSubjects(data: any) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.patch(this.apiUrl + '/assign-faculty', data)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }
}
