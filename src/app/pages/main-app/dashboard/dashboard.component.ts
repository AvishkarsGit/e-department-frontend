import { Component, computed, inject, signal } from '@angular/core';
import { CardComponent } from '../../../components/card/card.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { BoxesComponent } from './boxes/boxes.component';
import { BarVerticalChartComponent } from './charts/bar-vertical-chart/bar-vertical-chart.component';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { User } from '../../../interfaces/user.interface';
import { ProfileService } from '../../../services/profile/profile.service';
import { UsersComponent } from '../users/users.component';
import { GlobalService } from '../../../services/global/global.service';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { AppConstants } from '../../../constants/app.constants';

@Component({
  selector: 'app-dashboard',
  imports: [
    CardComponent,
    ChatBoxComponent,
    BoxesComponent,
    UsersComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  data = signal<any>(null);

  pieChartData: any[] = [
    {
      name: 'Germany',
      value: 3940000,
    },
    {
      name: 'USA',
      value: 5000000,
    },
    {
      name: 'France',
      value: 5200000,
    },
    {
      name: 'UK',
      value: 10200000,
    },
  ];

  verticalBarChartData = [
    {
      name: 'China',
      value: 2243772,
    },
    {
      name: 'USA',
      value: 1126000,
    },
    {
      name: 'Norway',
      value: 296215,
    },
    {
      name: 'Japan',
      value: 257363,
    },
    {
      name: 'Germany',
      value: 196750,
    },
    {
      name: 'France',
      value: 204617,
    },
  ];

  readonly profile = computed<User | null>(() => this.profileService.profile());

  private profileService = inject(ProfileService);
  private global = inject(GlobalService);
  private dashboardService = inject(DashboardService);

  constructor() {
    this.profileService.getProfile();
  }

  ngOnInit() {
    // this.getDashboardData();
  }

  async getDashboardData() {
    try {
      this.global.showSpinner();

      const params = {
        page: 1,
        size: AppConstants.PAGE_SIZE,
        sortField: 'id',
        sortOrder: 'desc',
        // filter: this.filterText(),
      };

      const data = await this.dashboardService.getDashboardData(params);
      console.log(data);

      this.data.set({ counts: data?.counts });
    } catch (e) {
      console.log(e);
      this.global.showErrorMessage(
        e,
        null,
        3000,
        false,
        'decreasing',
        'toast-top-center'
      );
    } finally {
      this.global.hideSpinner();
    }
  }
}
