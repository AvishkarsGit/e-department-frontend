import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripeHtml'
})
export class StripeHtmlPipe implements PipeTransform {

  transform(value: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = value;
    return tempDiv.textContent || tempDiv.innerText || '';
  }

}
