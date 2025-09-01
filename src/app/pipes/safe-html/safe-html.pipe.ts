import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { toHTML } from 'ngx-editor';

@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  // transform(value: string | null | undefined): SafeHtml {
  //   return this.sanitizer.bypassSecurityTrustHtml(value ?? '');
  // }

  transform(value: any): SafeHtml {
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      const html = toHTML(parsed);
      return this.sanitizer.bypassSecurityTrustHtml(html);
    } catch (e) {
      return value;
    }
  }
}
