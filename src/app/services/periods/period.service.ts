import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Period } from '../../interfaces/period.interface';

@Injectable({
  providedIn: 'root',
})
export class PeriodService {
  private apiUrl = 'periods';
  private http = inject(HttpService);

  async addPeriod(data: Period) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.post(this.apiUrl + '/save', data)
      );

      if (!response?.success) throw this.http.throwResponseError(response);

      return response;
    } catch (error) {
      throw Error;
    }
  }

  async getAllPeriods() {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/periods')
      );

      if (!response?.success) throw this.http.throwResponseError(response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async updatePeriod(data: Period, id: string) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.patch(this.apiUrl + `/update/${id}`, data)
      );

      if (!response?.success) throw this.http.throwResponseError(response);

      return response;
    } catch (error) {
      throw Error;
    }
  }

  async deletePeriod(id: string) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.delete(this.apiUrl + `/delete/${id}`)
      );
      if (!response?.success) throw new Error('Failed to delete');

      return response;
    } catch (error) {
      throw error;
    }
  }
}
