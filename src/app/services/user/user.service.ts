import { inject, Injectable } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpService);
  private apiUrl = 'user';

  constructor() {}

  async addUser(formData: User) {
    try {
      let formValues: any = formData;
      let isFormData = false;

      // Check if photo is selected (File type)
      if (formValues?.photo instanceof File) {
        formValues = this.http.convertToFormData(formValues);
        isFormData = true;
      }

      const response = await this.http.lastValueFrom(
        this.http.post(`${this.apiUrl}/add`, formValues, isFormData)
      );

      console.log('add user response: ', response);

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response?.data;
    } catch (e) {
      throw e;
    }
  }

  async updateUser(id: string, formValues: Partial<User>) {
    try {
      let isFormData = false;

      console.log(formValues);

  

      // Clean the JSON data before processing
      let updatedFormValues = this.http.cleanFormValues(formValues);

      // Check if photo is selected (File type)
      if (updatedFormValues?.photo instanceof File) {
        updatedFormValues = this.http.convertToFormData(updatedFormValues);
        isFormData = true;
      }

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

  async getUsers(params: any) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl+'/users', params)
      );

      // console.log(response);

      // if (!response?.success) {
      //   this.http.throwResponseError(response);
      // }

      return response;
    } catch (e) {
      throw e;
    }
  }

  async getManagers(params: any) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get('getManagers', params)
      );

      console.log(response);

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response;
    } catch (e) {
      throw e;
    }
  }

  async deleteUser(id: string) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.delete(`${this.apiUrl}/delete/${id}`)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response?.data;
    } catch (e) {
      throw e;
    }
  }

  async getUsersByRole(role_id?: number) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get('getUsers', role_id ? { role_id } : {})
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

  async checkAdminExists() {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get('user/checkAdminExists')
      );

      console.log('isAdminExists',response);

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response?.data?.admin_exists;
    } catch (e) {
      throw e;
    }
  }
}
