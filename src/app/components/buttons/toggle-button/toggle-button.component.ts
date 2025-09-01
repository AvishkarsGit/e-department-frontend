import { Component, OnInit, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss'],
  imports: [MatSlideToggleModule, FormsModule],
})
export class ToggleButtonComponent implements OnInit {
  readonly label = input<string>();
  readonly disabled = input<boolean>(false);
  readonly color = input<string>('accent');
  // readonly control = input<any>();

  checked = model<boolean>();

  constructor() {}

  ngOnInit() {}
}
