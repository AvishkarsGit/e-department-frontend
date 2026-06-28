import {
  Component,
  signal,
  input,
  inject,
  effect,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../../interfaces/user-profile.interface';
import { UserService } from '../../../services/user/user.service';
import { Faculty } from '../../../interfaces/faculty.interface';
import { Subject } from '../../../interfaces/subject.interface';

@Component({
  selector: 'app-view-profile',
  imports: [CommonModule],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.scss',
})
export class ViewProfileComponent {
  updateProfileItem = input<UserProfile>();


  profile = signal<UserProfile | null>(null);
  isStudent = signal(false);
  isFaculty = signal(false);

  ngOnInit() {
    //load data
    this.loadData();
  }

  loadData() {
    this.profile.set(this.updateProfileItem()!);
    this.updateRoleFlags();
  }


  private updateRoleFlags() {
    const profile = this.profile();

    if (!profile) return;

    this.isStudent.set(profile.role === 'student');
    this.isFaculty.set(
      profile.role === 'faculty' ||
        (profile.role === 'admin' && (profile.subjects?.length ?? 0) > 0)
    );
  }
}
