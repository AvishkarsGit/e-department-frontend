import { inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../http/http.service';
import { User } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  profile = signal<User | null>(null);

  private http = inject(HttpService);

  constructor() {}

  setProfile(value: User | null) {
    this.profile.set(value);
  }

  async getProfile(isForced = false) {
    try {
      if (this.profile() && !isForced) {
        return this.profile();
      }

      const response = await this.http.lastValueFrom(this.http.get('user/profile'));
      console.log('profile',response);

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      this.setProfile(response?.data);

      return response;
    } catch (e) {
      throw e;
    }
  }

  async updateProfile(formValue: any) {
    try {
      let isFormData = false;

      // Clean the JSON data before processing
      formValue = this.http.cleanFormValues(formValue);
      console.log(formValue);

      // Check if photo is selected (File type)
      if (formValue?.photo instanceof File) {
        formValue = this.http.convertToFormData(formValue);
        isFormData = true;
      }

      const response = await this.http.lastValueFrom(
        this.http.post('user/update_profile', formValue, isFormData)
      );
      console.log(response);

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      // this.setProfile(response?.data);
      this.profile.update((profile) => ({ ...profile, ...response?.data }));

      return response?.data;
    } catch (e) {
      throw e;
    }
  }
}
