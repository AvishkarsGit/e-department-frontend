import { Component, OnInit, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Strings } from '../../enums/strings';
import { AddButtonComponent } from "../buttons/add-button/add-button.component";

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.scss'],
  imports: [RouterLink, RouterLinkActive, AddButtonComponent]
})
export class ContentHeaderComponent implements OnInit {

  APP_NAME = Strings.APP_NAME; 
  title = input<string>();
  route = input<string>();
  // subTitle = input<string>();
  // color = input<string>();
  subRoute = input<string>();
  lastRoute = input<boolean>();
  lastRouteName = input<string>();

  buttonLabel = input<string>();

  onButtonClick = output<boolean>();

  constructor() { }

  ngOnInit() {
  }

  addButton() {
    this.onButtonClick.emit(true);
  }

}
