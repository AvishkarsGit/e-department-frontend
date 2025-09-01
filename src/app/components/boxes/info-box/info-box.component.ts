import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss'],
})
export class InfoBoxComponent implements OnInit {

  @Input() title: any;
  @Input() color: any;
  @Input() icon: any;
  @Input() count: any;
  @Input() tColor = 'black';
  @Input() price = false;

  constructor() { }

  ngOnInit() {
  }

}
