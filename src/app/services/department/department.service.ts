import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private http = inject(HttpService);
  private apiUrl = 'department';

  constructor() {}

  async getDepartments() {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/get-department')
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
