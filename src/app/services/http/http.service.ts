import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, firstValueFrom, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  baseUrl = environment.serverUrl;

  private http = inject(HttpClient);

  constructor() { }

  get(url: string, data?: any) {
    return this.http.get<any>(this.baseUrl + url, { params: data });
  }

  post(url: string, data: any, formData = false) {
    if (!formData) {
      data = new HttpParams({
        fromObject: data,
      });
    }
    return this.http.post<any>(this.baseUrl + url, data);
  }

  postProperJson(url: string, data: any, formData = false) {
    let body: any;
    let options = {};

    if (!formData) {
      // Send as JSON (properly handles nested objects)
      body = data;
      options = { headers: { 'Content-Type': 'application/json' } };
    } else {
      // Convert to FormData (for file uploads)
      const formDataObject = new FormData();
      Object.keys(data).forEach((key) => {
        if (typeof data[key] === 'object' && data[key] !== null) {
          formDataObject.append(key, JSON.stringify(data[key])); // Convert nested objects to JSON string
        } else {
          formDataObject.append(key, data[key]);
        }
      });
      body = formDataObject;
    }

    console.log('Sending data:', body); // Log the correct payload

    return this.http.post<any>(this.baseUrl + url, body, options);
  }

  put(url: string, data: any, formData = false) {
    if (!formData) {
      data = new HttpParams({
        fromObject: data,
      });
    }
    return this.http.put<any>(this.baseUrl + url, data);
  }

  patch(url: string, data: any, formData = false) {
    if (!formData) {
      data = new HttpParams({
        fromObject: data,
      });
    }
    return this.http.patch<any>(this.baseUrl + url, data);
  }

  delete(url: string) {
    return this.http.delete<any>(this.baseUrl + url);
  }

  firstValueFrom(value: Observable<any>) {
    return firstValueFrom(value);
  }

  lastValueFrom(value: Observable<any>) {
    return lastValueFrom(value);
  }

  postWithHeaders(url: string, data: any, headers: HttpHeaders) {
    return this.http.post<any>(this.baseUrl + url, data, { headers });
  }

  // Utility function to remove null, undefined, and empty string values
  cleanFormValues(data: any): any {
    return Object.fromEntries(
      Object.entries(data).filter(
        ([_, v]) => v !== null && v !== undefined && v !== ''
      )
    );
  }

  throwResponseError(response: any) {
    console.log(response);
    const errorMessage = {
      error: {
        message: response?.message,
      },
    };
    throw errorMessage;
  }

  convertToFormData(formValues: any) {
    console.log('actual data', formValues);

    const formData = new FormData();

    Object.keys(formValues).forEach((key) => {
      const value = formValues[key];
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } else if (typeof value === 'object' && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    console.log('converted to formdata', Array.from(formData.entries()));

    return formData;
  }

  async downloadImage(imageUrl: string): Promise<void> {
    try {
      const filename =
        imageUrl.split('/').pop()?.split('?')[0].split('#')[0] ||
        'downloaded-file';

      const blob = await this.firstValueFrom(
        this.http.get(
          this.baseUrl + `proxy-image?url=${encodeURIComponent(imageUrl)}`,
          { responseType: 'blob' }
        )
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename; // Change the filename as needed
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  }
}
