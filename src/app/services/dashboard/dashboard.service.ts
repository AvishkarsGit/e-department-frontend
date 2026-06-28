import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { ProfileService } from '../profile/profile.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpService);
  private profileService = inject(ProfileService);
  private apiUrl = 'dashboard';

  constructor() {}

  async getDashboardData(params: any) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get('getPortalDashboard', params)
      );
      console.log(response);

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      const fetchedData = response?.data;
      console.log(fetchedData);

      return fetchedData;
    } catch (e) {
      throw e;
    }
  }

  async getCommonDashboard() {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get('getCommonDashboard')
      );
      console.log(response);

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      const fetchedData = response?.data;
      console.log(fetchedData);

      // set branches
      // this.branchService.setBranches(fetchedData?.branches);

      // set profile
      this.profileService.setProfile(fetchedData?.profile);

      return fetchedData;
    } catch (e) {
      throw e;
    }
  }

  async getBoxesData() {
    try {
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/boxes')
      );
      if (!response?.success) this.http.throwResponseError(response);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
