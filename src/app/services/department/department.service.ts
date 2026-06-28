import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Department } from '../../interfaces/department.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private http = inject(HttpService);
  private apiUrl = 'department';

  constructor() { }

  //adding the data from the form
  async addDepartment(formData: Department) {
    try {
      let formValues: any = formData;

      const response = await this.http.lastValueFrom(
        this.http.post(`${this.apiUrl}/create-department`, formValues)
      );
      console.log('add department response: ', response);

      if (!response?.success) {
        this.http.throwResponseError(response);
      }
      return response?.data;
    }
    catch (e) {
      throw e;
    }
  }

  //Update
  async updateDepartment(id: string, formValues: Partial<Department>) {
    try {
      // let isFormData = false;
      console.log(formValues);
      //clean the JSON data before processing
      let updatedFormValues = this.http.cleanFormValues(formValues);

      const response = await this.http.lastValueFrom(
        this.http.patch(
          `${this.apiUrl}/update-department/${id}`,
          updatedFormValues
        )
      )
      if (!response?.success) {
        this.http.throwResponseError(response);
      }
      return response?.data;

    } catch (e) {
      throw e;
    }
  }

  //get data

  async getDepartments(params?: any){
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/get-department', params)
      )
      if (!response?.success) this.http.throwResponseError(response);

      return response;

    } catch (error) {
      throw error;
    }
  }
  async getAllDepartments(){
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/get-all-departments')
      )
      if (!response?.success) this.http.throwResponseError(response);

      return response;

    } catch (error) {
      throw error;
    }
  }

  //delete Data
  async deleteDepartment(id: string) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.delete(`${this.apiUrl}/delete-department/${id}`)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }
      return response?.data;
    } catch (error) {
      throw error;
    }
  }
}
