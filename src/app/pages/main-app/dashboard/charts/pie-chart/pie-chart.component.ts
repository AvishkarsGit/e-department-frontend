import { Component, input, signal } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-pie-chart',
  imports: [NgxChartsModule],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
})
export class PieChartComponent {
  data = input<any[]>();
  view: [number, number] = [600, 400];

  // options
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: any = 'right';

  colorScheme = signal<any>({
    name: 'Payment Chart',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [],
  });

  constructor() {
    // Object.assign(this, { data: this.data });
  }

  ngOnInit() {
    this.colorScheme.update((scheme) => {
      return {
        ...scheme,
        domain: [
          this.getCSSVariable('--primary-color'),
          this.getCSSVariable('--primary-light-color'),
          '#F4A929FF',
          this.getCSSVariable('--secondary-color'),
          this.getCSSVariable('--tertiary-color'),
          this.getCSSVariable('--warning-color'),
          // this.getCSSVariable('--warning-color'),
          // '#5a108f','#7b2cbf','#ecbcfd','#ffceff'
          '#3c096c',
          '#7b2cbf',
          '#ff7900',
          '#3B82F6',
          '#A855F7',
        ],
      };
    });
  }

  getCSSVariable(name: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
