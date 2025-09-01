import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Role } from '../../interfaces/user.interface';
// import { Role } from '../../interfaces/role.interface';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private http = inject(HttpService);
  private apiUrl = 'roles';

  constructor() {}

  async addRole(formData: Role) {
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

  async updateRole(id: number, formValues: Partial<Role>) {
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

  async getRoles(params: any) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl, params)
      );
      return response;
    } catch (e) {
      throw e;
    }
  }

  async getAllRoles(query?: string) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get('getRoles', query ? { query } : {})
      );
      console.log(response);
      
      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response?.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteRole(id: number) {
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
