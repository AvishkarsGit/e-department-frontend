import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth.guard';
import { roleGuard } from './guards/role/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/app',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/auth.component').then((c) => c.AuthComponent),
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./layout/layout.component').then((c) => c.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: '/app/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/main-app/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/main-app/profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/main-app/users/users.component').then(
            (c) => c.UsersComponent
          ),
        data: {
          role: 'admin',
          // role_name: 'Admin'
        },
        canActivate: [roleGuard],
      },
        {
        path: 'departments',
        loadComponent: () =>
          import('./pages/main-app/departments/departments.component').then(
            (c) => c.DepartmentsComponent
          ),
        data: {
          role: 'admin',
          // role_name: 'Admin'
        },
        canActivate: [roleGuard],
      },
      {
        path: 'countries',
        loadComponent: () =>
          import('./pages/main-app/countries/countries.component').then(
            (c) => c.CountriesComponent
          ),
      },
      {
        path: 'states',
        loadComponent: () =>
          import('./pages/main-app/states/states.component').then(
            (c) => c.StatesComponent
          ),
      },
      
      {
        path: 'manager-report',
        loadComponent: () =>
          import('./pages/main-app/reports/manager-report/manager-report.component').then(
            (c) => c.ManagerReportComponent
          ),
        data: {
          role: 'admin',
        },
        canActivate: [roleGuard],
      },
    ],
  },
  
  // 404 fallback route — should always be last
  {
    path: '**',
    redirectTo: '/app/dashboard',
    pathMatch: 'full',
  },
];
