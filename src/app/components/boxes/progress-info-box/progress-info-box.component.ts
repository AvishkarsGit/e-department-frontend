import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-info-box',
  templateUrl: './progress-info-box.component.html',
  styleUrls: ['./progress-info-box.component.scss'],
})
export class ProgressInfoBoxComponent implements OnInit {

  @Input() title: any;
  @Input() color: any;
  @Input() icon: any;
  @Input() count: any;
  @Input() progress: any;
  @Input() width: any;
  @Input() tColor: any;

  constructor() { }

  ngOnInit() {
  }

}
