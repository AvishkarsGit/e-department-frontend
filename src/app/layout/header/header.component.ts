import { Component, computed, inject } from '@angular/core';
import { ProfileService } from '../../services/profile/profile.service';
import { User } from '../../interfaces/user.interface';
import { HeaderOptionsComponent } from './header-options/header-options.component';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { GlobalService } from '../../services/global/global.service';

@Component({
  selector: 'app-header',
  imports: [HeaderOptionsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  readonly profile = computed<User | null>(() => this.profileService.profile());

  private profileService = inject(ProfileService);

  constructor() {
    this.profileService.getProfile();
  }

  toggleSidebar() {
    document.body.classList.toggle('sidebar-collapse');
    document.body.classList.toggle('sidebar-open');
  }
}
