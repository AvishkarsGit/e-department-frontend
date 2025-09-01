import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  imports: [],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss'
})
export class IconButtonComponent {
  readonly icon = input<string>();
  readonly color = input<string>('var(--tertiary-color)');
  readonly addBtnClass = input<string>('ms-1');
  readonly addIconClass = input<string>();

  onClick = output<boolean>();

  btnClick() {
    this.onClick.emit(true);
  }
}
