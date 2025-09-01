import { Component, input, OnInit } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  imports: [NgxSpinnerModule]
})
export class SpinnerComponent implements OnInit {

  type = input<string>('ball-scale-multiple');
  color = input<string>('var(--secondary-color)');
  textColor = input<string>('var(--primary-light-color)');
  text = input<string>('Please wait...');

  constructor() { }

  ngOnInit(): void {
  }

}
