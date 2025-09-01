import { Component, OnInit, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.scss'],
  imports: [MatIconModule]
})
export class SubmitButtonComponent implements OnInit {

  readonly color = input<string>('var(--primary-color)');
  readonly icon = input<string>('present_to_all');
  readonly name = input<string>('SUBMIT');
  readonly type = input<string>('submit');
  // submit = output<boolean>();
  constructor() { }

  ngOnInit() {
  }

  // onSubmit() {
  //   this.submit.emit(true);
  // }

}
