import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-small-box',
  templateUrl: './small-box.component.html',
  styleUrls: ['./small-box.component.scss'],
})
export class SmallBoxComponent implements OnInit {

  @Input() title: any;
  @Input() color: any;
  @Input() icon: any;
  @Input() count: any;
  @Input() link: any;
  @Input() price = false;

  constructor() { }

  ngOnInit() {
  }

}
