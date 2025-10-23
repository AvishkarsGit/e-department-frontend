import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private http = inject(HttpService);
  private auth = inject(AuthService);
  private apiUrl = 'chat';

  async sendMessage(message: string) {
    try {
      //get the token
      const token = this.auth.token();
      if (!token) throw new Error('No token found');
      const body = { message, token };
      const response: any = await this.http.lastValueFrom(
        this.http.post(`${this.apiUrl}/generate`, body)
      );

      return response.reply; //
    } catch (error) {
      throw error;
    }
  }
}
