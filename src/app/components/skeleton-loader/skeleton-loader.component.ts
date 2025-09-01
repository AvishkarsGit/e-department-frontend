import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss'],
})
export class SkeletonLoaderComponent implements OnInit {

  @Input() count = 1;
  @Input() theme = { 'border-radius': '5px', height: '10px', border: '1px solid white' };

  constructor() { }

  ngOnInit(): void {
  }

}
