import { MatIconModule } from '@angular/material/icon';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-click-button',
  imports: [MatButtonModule, MatIconModule, NgClass],
  templateUrl: './click-button.component.html',
  styleUrl: './click-button.component.scss'
})
export class ClickButtonComponent {

  readonly label = input<string>();
  readonly icon = input<string>();
  readonly color = input<string>('');
  readonly customColorClass = input<string>('bg-tertiary-color');

  onClick = output<boolean>();

  buttonClicked() {
    this.onClick.emit(true);
  }

}
