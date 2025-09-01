import { MatIconModule } from '@angular/material/icon';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './add-button.component.html',
  styleUrl: './add-button.component.scss'
})
export class AddButtonComponent {

  label = input<string>();
  // color = input<string>('accent');
  color = input<string>('');
  classes = input<string>('bg-white primary-color');

  onClick = output<boolean>();

  addItem() {
    this.onClick.emit(true);
  }

}
