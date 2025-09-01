import { NgClass } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { GlobalService } from '../../services/global/global.service';
import { MenuItem } from '../../interfaces/menu-item.interface';
import { MENU_ITEMS } from '../../constants/menu.constants';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { Strings } from '../../enums/strings';
import { Role, User } from '../../interfaces/user.interface';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-sidebar',
  imports: [OverlayscrollbarsModule, RouterLink, RouterLinkActive, NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  APP_NAME = Strings.APP_NAME;

  activeMenu = signal<string | null>(null);
  menuItems = signal<MenuItem[] | null>(null);

  readonly profile = computed<User | null>(() => this.profileService.profile());

  private auth = inject(AuthService);
  private global = inject(GlobalService);

  private profileService = inject(ProfileService);

  constructor() {
    this.profileService.getProfile();

    // Use Angular effect for reactive updates
    effect(
      () => {
        const profile = this.profile();
        const roleId = profile?.role;

        if (roleId != null) {
          const filtered = this.filterMenuItemsByRole(MENU_ITEMS, roleId);
          this.menuItems.set(filtered);
        }
      }
    );
  }

  ngOnInit(): void {}

  toggleMenu(label: string | undefined) {
    this.activeMenu.set(this.activeMenu() === label ? null : label ?? '');
  }

  async logoutAlert() {
    const result = await this.global.showAlert(
      'ALERT',
      'Are you sure, you want to logout?',
      'YES',
      false,
      'NO',
      'warning'
    );
    if (result.isConfirmed) {
      this.auth.logout();
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === this.global.cancelSwal()
    ) {
      // enter any functionality here
    }
  }

  filterMenuItemsByRole(menuItems: MenuItem[], userRoleId: Role): MenuItem[] {
    return menuItems
      .filter((item) => {
        // If allowedRoles is not defined, allow by default
        if (!item?.allowedRoles) return true;

        return item.allowedRoles.includes(userRoleId);
      })
      .map((item) => {
        // If children exists, recursively filter them
        if (item.children) {
          const filteredchildren = item.children.filter((sub) => {
            if (!sub.allowedRoles) return true;
            return sub.allowedRoles.includes(userRoleId);
          });

          // Only include item if it has filtered children
          if (filteredchildren.length) {
            return { ...item, children: filteredchildren };
          }

          // If parent has no children left but was allowed itself
          return item.allowedRoles?.includes(userRoleId)
            ? { ...item, children: [] }
            : null;
        }

        return item;
      })
      .filter(Boolean) as MenuItem[]; // Remove any nulls
  }
}
