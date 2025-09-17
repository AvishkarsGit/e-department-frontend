import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { faculty } from '../../interfaces/faculty.interface';

@Injectable({
  providedIn: 'root'
})
export class FacultiesService {
  private apiUrl = 'faculty';
  private http = inject(HttpService);

  async getFaculty(params?:any){
    try{
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl+'/get-faculty',params)
      )
      return response;
    }catch(error){
      throw error
    }
  }

  async createFaculty(formData:faculty){
    try{
      let formValues : any = formData;
      const response = await this.http.lastValueFrom(
        this.http.post(`${this.apiUrl}/create-faculty`,formValues)
      );
      console.log('add department response:', response);

      if(!response?.success){
        this.http.throwResponseError(response);
      }

    }catch(error){
      throw error
    }
  }

  async updateFaculty(id:string,formValues:Partial<faculty>){
    try{
    let updatedFormValues= this.http.cleanFormValues(formValues);

    const response = await this.http.lastValueFrom(
      this.http.patch(
        `${this.apiUrl}/update-faculty/${id}`,
        updatedFormValues
      )
      );
      console.log("Updated Faculty:",response);
    }catch(error){
     throw error;
    }
  }

  async deleteFaculty(id:string){
    try{
    const response = await this.http.lastValueFrom(
     this.http.delete(
      `${this.apiUrl}/delete-faculty/${id}`
     )
    );
    if(!response?.success){
      this.http.throwResponseError(response);
    }
    }catch(error){
      throw error;
    }
  }
}
