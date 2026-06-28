import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private apiUrl = 'subject';
  private http = inject(HttpService);

  async getSubjects(params: any) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/subjects', params)
      );

      return response;
    } catch (error) {
      throw error;
    }
  }
  async getAllSubjects() {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/allSubjects')
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }


  async getAllClasses() {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/classes')
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async fetchClassId(data: {
    dept_id: string;
    year: number;
    semester: number;
  }) {
    try {
      const params = {
        department_id: data?.dept_id,
        year: data?.year,
        semester: data?.semester,
      };
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/fetchClassId', params)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async addSubject(data: { name: string; code: string; class_id: string }) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.post(this.apiUrl + '/add', data)
      );
      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateSubject(
    id: string,
    data: { name: string; code: string; class_id: string }
  ) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.patch(`${this.apiUrl}/update/${id}`, data)
      );
      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteSubject(id: string) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.delete(`${this.apiUrl}/delete/${id}`)
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
