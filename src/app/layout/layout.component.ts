import { Component, HostListener } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from '../components/spinner/spinner.component';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    SpinnerComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const sidebar = document.querySelector('aside.app-sidebar');
    const toggleBtn = document.querySelector('[data-lte-toggle="sidebar"]');
    const body = document.body;

    const isMobile = window.innerWidth < 992;
    const isOpen = body.classList.contains('sidebar-open');

    if (
      isMobile &&
      isOpen &&
      sidebar &&
      !sidebar.contains(event.target as Node) &&
      (!toggleBtn || !toggleBtn.contains(event.target as Node))
    ) {
      body.classList.remove('sidebar-open');
      body.classList.add('sidebar-collapse');
    }
  }
}
