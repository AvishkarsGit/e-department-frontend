import { Component, inject, input, signal } from '@angular/core';
import { MediumBoxComponent } from '../../../../components/boxes/medium-box/medium-box.component';
import { DashboardService } from '../../../../services/dashboard/dashboard.service';
import { ProfileService } from '../../../../services/profile/profile.service';

interface Summary {
  total_classes: number;
  total_classes_attended: number;
  attendance_percentage: number;
}
@Component({
  selector: 'app-boxes',
  imports: [MediumBoxComponent],
  templateUrl: './boxes.component.html',
  styleUrl: './boxes.component.scss',
})
export class BoxesComponent {
  data = signal<any | null>(null);
  role = signal<string | null>(null);

  private dashboardService = inject(DashboardService);
  private profileService = inject(ProfileService);

  async ngOnInit() {
    await this.getBoxesData();
  }

  async getBoxesData() {
    //get role
    const role = await this.profileService.profile()?.role!;
    //set role
    this.role.set(role);
    //set data
    const response = await this.dashboardService.getBoxesData();
    this.data.set(response?.data);
  }
}
