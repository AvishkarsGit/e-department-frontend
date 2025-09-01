import { Component, input, signal } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-bar-vertical-chart',
  imports: [NgxChartsModule],
  templateUrl: './bar-vertical-chart.component.html',
  styleUrl: './bar-vertical-chart.component.scss',
})
export class BarVerticalChartComponent {
  // data goes here
  data = input<any[]>();
  // view: [number, number] = [600, 400];
  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Sites';
  showYAxisLabel = true;
  yAxisLabel = 'Work Progress';
  timeline = true;
  doughnut = true;
  colorScheme = signal<any>({
    name: 'Sales report',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      'var(--primary-color)',
      '#EC4899',
      'var(--secondary-color)',
      '#F59E0B',
      'var(--tertiary-color)',
      '#9370DB',
      '#FA8072',
      '#87CEFA',
      '#FF7F50',
      '#90EE90',
      '#9370DB',
      'var(--dark-color)',
    ],
  });

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }
}
