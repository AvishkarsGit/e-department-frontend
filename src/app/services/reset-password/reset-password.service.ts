import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private http = inject(HttpService);
  private apiUrl = 'user';

  constructor() { }

  async sendResetPasswordOtp(email: string) {
    try {
      const response = await this.http.lastValueFrom(
        this.http.patch(this.apiUrl + '/send/reset/password/token', email)
      );
      console.log(response);
      return response;
    } catch(e) {
      throw(e);
    }
  }

  async verifyResetPasswordOtp(email: string, otp: string) {
    try {
      const data = { 
        email,
        otp 
      };
      const response = await this.http.lastValueFrom(this.http.post('verifyOtp', data));
      console.log(response);
      return response;
    } catch(e) {
      throw(e);
    }
  }

  async resetPassword(data: any) {
    try {
      const response = await this.http.lastValueFrom(this.http.post('resetPassword', data));
      console.log(response);
      return response;
    } catch(e) {
      throw(e);
    }
  }
}
