import { Component, inject, input, signal } from '@angular/core';
import { MediumBoxComponent } from '../../../../components/boxes/medium-box/medium-box.component';
import { DashboardService } from '../../../../services/dashboard/dashboard.service';
import { ProfileService } from '../../../../services/profile/profile.service';
import { AuthService } from '../../../../services/auth/auth.service';

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
  private authService = inject(AuthService);

  private dummy_data = [
    {
      name: 'Dr. Anil Sharma',
      phone: '9000000001',
      email: 'anil.sharma@college.edu',
      photo: '../../../../../assets/images/1.jpg',
      username: 'anilsharma',
      password: 'pass123',
    },
    {
      name: 'Prof. Neha Verma',
      phone: '9000000002',
      email: 'neha.verma@college.edu',
      photo: '../../../../../assets/images/2.jpg',
      username: 'nehaverma',
      password: 'verma456',
    },
    {
      name: 'Dr. Rahul Mehta',
      phone: '9000000003',
      email: 'rahul.mehta@college.edu',
      photo: '../../../../../assets/images/3.jpg',
      username: 'rahulmehta',
      password: 'rahul789',
    },
    {
      name: 'Prof. Pooja Singh',
      phone: '9000000004',
      email: 'pooja.singh@college.edu',
      photo: '../../../../../assets/images/4.jpg',
      username: 'poojasingh',
      password: 'pooja321',
    },
    {
      name: 'Dr. Amit Patel',
      phone: '9000000005',
      email: 'amit.patel@college.edu',
      photo: '../../../../../assets/images/5.jpg',
      username: 'amitpatel',
      password: 'amit654',
    },
  ];

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
