import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GlobalService } from '../../../services/global/global.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Strings } from '../../../enums/strings';
import { ProfileService } from '../../../services/profile/profile.service';
import { VerifyEmailComponent } from '../verify-email/verify-email.component';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';

@Component({
  selector: 'app-verification',
  imports: [
    VerifyEmailComponent,
    SpinnerComponent
  ],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.scss',
})
export class VerificationComponent {
  @ViewChild('emailVerificationTemplate') emailVerificationTemplate!: TemplateRef<any>;
  private global = inject(GlobalService);

  ngAfterViewInit() {
    this.openVerificationModal();
  }

   openVerificationModal() {
    this.global.showModal(this.emailVerificationTemplate, true);
  }
}
