import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-datepipe-text-format',
  imports: [DatePipe],
  templateUrl: './datepipe-text-format.component.html',
  styleUrl: './datepipe-text-format.component.scss',
})
export class DatepipeTextFormatComponent {
  value = input<any>();
  format = input<string>('mediumDate');
}
