import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Student } from '../../interfaces/student.interface';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'student';
  private http = inject(HttpService);

  async addStudent(data: any) {
    try {
      let formValues: any = data;
      let isFormData = false;

      // Check if photo is selected (File type)
      if (formValues?.photo instanceof File) {
        formValues = this.http.convertToFormData(formValues);
        isFormData = true;
      }

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

  async getStudents(params: any) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/students', params)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response;
    } catch (e) {
      throw e;
    }
  }

  async updateStudent(id: string, user_id: string, data: any) {
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
          `${this.apiUrl}/update/${user_id}/${id}`,
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

  async deleteStudent(id: string, user_id: string) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.delete(`${this.apiUrl}/delete/${user_id}/${id}`)
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
