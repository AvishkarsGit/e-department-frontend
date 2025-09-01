import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GlobalService } from '../../../services/global/global.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'app-print-button',
  imports: [MatIconModule, TooltipModule],
  templateUrl: './print-button.component.html',
  styleUrl: './print-button.component.scss',
})
export class PrintButtonComponent {
  readonly elementId = input.required<string>();
  readonly title = input.required<string>();
  readonly tooltip = input<string>('Print');

  private global = inject(GlobalService);

  print() {
    // const fromDate = this.global.dateFormat(this.model.fromDate, 'ddMMyyyy');
    // const toDate = this.global.dateFormat(this.model.toDate, 'ddMMyyyy');
    // const title = this.restaurant?.name + '_' + fromDate + '_' + toDate;
    this.global.print(this.elementId(), this.title());
  }
}
