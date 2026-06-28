import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private http = inject(HttpService);
  private apiUrl = 'uploads';

  async uploadMaterial(data: any) {
    try {
      let formValues: any = data;
      let isFormData = false;

      // Check if photo is selected (File type)
      if (formValues?.uploaded_url instanceof File) {
        formValues = this.http.convertToFormData(formValues);
        isFormData = true;
      }
      const response = await this.http.lastValueFrom(
        this.http.post(`${this.apiUrl}/upload`, formValues, isFormData)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async getAllMaterial(params: any) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/getAllMaterial', params)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateMaterial(id: string, data: any) {
    try {
      let formValues: any = data;
      let isFormData = false;

      // Check if photo is selected (File type)
      if (formValues?.uploaded_url instanceof File) {
        formValues = this.http.convertToFormData(formValues);
        isFormData = true;
      }
      const response = await this.http.lastValueFrom(
        this.http.patch(`${this.apiUrl}/update/${id}`, formValues, isFormData)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteMaterial(id: string) {
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

  async downloadFile(id: string) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(`${this.apiUrl}/download/${id}`)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response;
    } catch (err) {
      throw err;
    }
  }
}
