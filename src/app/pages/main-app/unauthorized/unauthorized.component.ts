import { Component } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { SidebarComponent } from '../../../layout/sidebar/sidebar.component';
import { HeaderComponent } from "../../../layout/header/header.component";
import { LayoutComponent } from "../../../layout/layout.component";

@Component({
  selector: 'app-unauthorized',
  imports: [ ProfileComponent, HeaderComponent],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent {

}
