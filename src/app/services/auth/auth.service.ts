import { inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { Router } from '@angular/router';
import { HttpService } from '../http/http.service';
import { Strings } from '../../enums/strings';
import { ProfileService } from '../profile/profile.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private storage = inject(StorageService);
  private http = inject(HttpService);
  private profileService = inject(ProfileService);
  private apiUrl = 'user';
  private isVerified = signal<boolean>(false);

  token = signal<string | null>(null);

  constructor() {}

  updateToken(token: string | null) {
    this.token.set(token);
  }

  updateIsVerified(value: boolean) {
    this.isVerified.set(value);
  }

  setUserData(token: string) {
    this.storage.setStorage(Strings.TOKEN, token);
    this.updateToken(token);
  }

  getToken() {
    if (!this.token()) {
      const token = this.storage.getStorage(Strings.TOKEN);
      this.updateToken(token);
    }
  }

  setIsVerified(value: boolean) {
    this.storage.setStorage(Strings.IS_VERIFIED, value);
    this.updateIsVerified(value);
  }

  getIsVerified(): Boolean {
    let value: boolean;
    if (!this.isVerified()) {
      const result = this.storage.getStorage(Strings.IS_VERIFIED);
      if (result === 'true') value = true;
      else value = false;
      this.updateIsVerified(value);
    }
    return value!;
  }

  async register(formData: any) {
    try {
      let formValues: any = formData;
      let isFormData = false;

      // Check if photo is selected (File type)
      if (formValues?.photo instanceof File) {
        formValues = this.http.convertToFormData(formValues);
        isFormData = true;
      }

      const response = await lastValueFrom(
        this.http.post(this.apiUrl + '/signup', formValues, isFormData)
      );
      console.log(response);

      //save token in local storage
      this.setUserData(response?.data?.accessToken);

      return response?.data;
    } catch (e) {
      throw e;
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const data = {
        email,
        password,
      };
      console.log(data);

      const response = await lastValueFrom(this.http.post('user/login', data));

      console.log('response', response);

      //save token in local storage
      this.setUserData(response?.data?.accessToken);

      return response;
    } catch (e) {
      throw e;
    }
  }

  navigateByUrl(url: string) {
    this.router.navigateByUrl(url, { replaceUrl: true });
  }

  isLoggedIn(): boolean {
    const token = this.storage.getStorage(Strings.TOKEN);
    return !!token;
  }

  async logout() {
    try {
      const response = await lastValueFrom(this.http.get('user/logout'));
      console.log(response);
      this.logoutFromDevice();
    } catch (e) {
      console.log(e);
      this.logoutFromDevice();
    }
  }

  logoutFromDevice() {
    this.storage.removeStorage(Strings.TOKEN);
    this.updateToken(null);
    this.profileService.setProfile(null);
    this.router.navigateByUrl(Strings.LOGIN, { replaceUrl: true });
  }

  async checkUser(email: string) {
    try {
      const data = { email };
      const response = await this.http.lastValueFrom(
        this.http.get(this.apiUrl + '/exists', data)
      );
      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async sendOtp(email: string) {
    try {
      const data = { email };
      const response = await this.http.lastValueFrom(
        this.http.patch(this.apiUrl + '/send/verification/token', data)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(email: string, otp: string) {
    try {
      const data = { email, otp };
      const response = await this.http.lastValueFrom(
        this.http.patch(this.apiUrl + '/verify-email', data)
      );

      if (!response?.success) {
        this.http.throwResponseError(response);
      }
      //set email is verified
      this.setIsVerified(true);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
