import { Component, inject, input, signal } from '@angular/core';
import { User } from '../../../interfaces/user.interface';
import { AuthService } from '../../../services/auth/auth.service';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Strings } from '../../../enums/strings';

@Component({
  selector: 'app-header-options',
  imports: [NgClass, RouterLink, ReactiveFormsModule],
  templateUrl: './header-options.component.html',
  styleUrl: './header-options.component.scss',
})
export class HeaderOptionsComponent {

  avatar = Strings.AVATAR_IMAGE;

  isProfileOpen = signal<boolean>(false);

  form = signal<FormGroup | null>(null);

  readonly profile = input<User>();

  public auth = inject(AuthService);

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const form = new FormGroup({
      branch: new FormControl(null),
    });

    this.form.set(form);
  }

  setProfileOpen(value?: boolean) {
    this.isProfileOpen.set(value ?? !this.isProfileOpen());
  }

  toggleProfileDropdown() {
    this.setProfileOpen();
  }

  toggleFullscreen() {
    // event.preventDefault();
    const doc: any = document;
    const docEl: any = document.documentElement;

    if (
      !doc.fullscreenElement &&
      !doc.webkitFullscreenElement &&
      !doc.mozFullScreenElement &&
      !doc.msFullscreenElement
    ) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  }
}
