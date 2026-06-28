import { Component, input, output } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'app-icon-round-button',
  imports: [TooltipModule],
  templateUrl: './icon-round-button.component.html',
  styleUrl: './icon-round-button.component.scss'
})
export class IconRoundButtonComponent {
  readonly icon = input<string>();
  readonly color = input<string>();
  readonly backgroundColor = input<string>();
  readonly addBtnClass = input<string>('me-1');
  readonly addIconClass = input<string>();
  readonly tooltip = input<string>();

  onClick = output<boolean>();

  btnClick() {
    this.onClick.emit(true);
  }
}
