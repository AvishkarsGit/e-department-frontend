import { Component, input } from '@angular/core';
import { MediumBoxComponent } from '../../../../components/boxes/medium-box/medium-box.component';

@Component({
  selector: 'app-boxes',
  imports: [MediumBoxComponent],
  templateUrl: './boxes.component.html',
  styleUrl: './boxes.component.scss'
})
export class BoxesComponent {

  counts = input<any>();

}
