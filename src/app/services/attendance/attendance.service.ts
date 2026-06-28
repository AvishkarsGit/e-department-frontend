import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private http = inject(HttpService);
  private apiUrl = 'attendance';

  async filterStudentBySubject(subject_id: string) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + `/filteredBySubject/${subject_id}`)
      );

      if (!response?.success) throw this.http.throwResponseError(response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async getAllSubjects() {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/fetch/subjects')
      );
      if (!response?.success) throw this.http.throwResponseError(response);

      return response?.data;
    } catch (e) {
      throw e;
    }
  }

  async fetchAllPeriods() {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/fetch/periods')
      );

      if (!response?.success) throw new Error('Failed to get periods');

      return response;
    } catch (error) {
      throw error;
    }
  }

  async markAttendance(data: any) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.post(this.apiUrl + '/save', data)
      );

      if (!response?.success) throw this.http.throwResponseError(response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async fetchClasses() {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/getClasses')
      );

      if (!response?.success) this.http.throwResponseError(response);

      return response?.data;
    } catch (error) {
      throw error;
    }
  }

  async fetchSubjectsByClass(class_id: string) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + `/fetchSubjectsByClass/${class_id}`)
      );

      if (!response?.success) this.http.throwResponseError(response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async fetchAttendanceBySubject(params: any) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/filterAttendance', params)
      );
      if (!response?.success) this.http.throwResponseError(response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async getStudentAttendance(params: any) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/getStudentAttendance', params)
      );
      if (!response?.success) this.http.throwResponseError(response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async filterAttendanceForExport(params: any) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/filterAttendanceExcel', params)
      );
      if (!response?.success) this.http.throwResponseError(response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async fetchAllDates(params: any) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/fetchAllAttendanceDate', params)
      );

      if (!response?.success) this.http.throwResponseError(response);

      return response?.data;
    } catch (error) {
      throw error;
    }
  }

  async fetchStudentAttendance(params: any) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/student/attendance', params)
      );
      if (!response?.success) this.http.throwResponseError(response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  
}
