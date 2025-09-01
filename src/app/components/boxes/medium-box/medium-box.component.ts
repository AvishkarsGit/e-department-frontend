import { LowerCasePipe, NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-medium-box',
  templateUrl: './medium-box.component.html',
  styleUrls: ['./medium-box.component.scss'],
  imports: [LowerCasePipe, NgClass]
})
export class MediumBoxComponent {

  readonly title = input.required<string>();
  readonly subTitle = input<string>();
  readonly value = input<number>(0);
  readonly icon = input.required<string>();
  readonly iconBgColor = input<string>();
  readonly iconColor = input<string>();
  readonly todayValue = input<number>(0);
  readonly badgeBgColor = input<string>();
  readonly badgeTextColor = input<string>();
  readonly isShortInfo = input<boolean>(true);

}
