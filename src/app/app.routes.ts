import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth.guard';
import { roleGuard } from './guards/role/role.guard';
import { verifyEmailGuardGuard } from './guards/verify-email/verify-email.guard';
import { statusGuard } from './guards/status/status.guard';

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
    path: 'verification',
    loadComponent: () =>
      import('./pages/auth/verification/verification.component').then(
        (c) => c.VerificationComponent
      ),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/main-app/unauthorized/unauthorized.component').then(
        (c) => c.UnauthorizedComponent
      ),
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./layout/layout.component').then((c) => c.LayoutComponent),
    canActivate: [authGuard, verifyEmailGuardGuard, statusGuard],
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
      // classes
      {
        path: 'classes',
        loadComponent: () =>
          import('./pages/main-app/classes/classes.component').then(
            (c) => c.ClassesComponent
          ),
        data: {
          role: 'admin',
        },
        canActivate: [roleGuard],
      },

      // attendance
      {
        path: 'attendances',
        loadComponent: () =>
          import('./pages/main-app/attendance/attendance.component').then(
            (c) => c.AttendanceComponent
          ),
        data: {
          roles: ['admin', 'faculty'],
        },
        canActivate: [roleGuard],
      },
      // summaries
      {
        path: 'summaries',
        loadComponent: () =>
          import('./pages/main-app/summaries/summaries.component').then(
            (c) => c.SummariesComponent
          ),
        data: {
          roles: ['admin', 'faculty'],
        },
        canActivate: [roleGuard],
      },

      // periods
      {
        path: 'periods',
        loadComponent: () =>
          import('./pages/main-app/periods/periods.component').then(
            (c) => c.PeriodsComponent
          ),
        data: {
          role: 'admin',
          // role_name: 'Admin'
        },
        canActivate: [roleGuard],
      },
      // faculties
      {
        path: 'faculties',
        loadComponent: () =>
          import('./pages/main-app/faculties/faculties.component').then(
            (c) => c.FacultiesComponent
          ),
        data: {
          role: 'admin',
          // role_name: 'Admin'
        },
        canActivate: [roleGuard],
      },
      //students
      {
        path: 'students',
        loadComponent: () =>
          import('./pages/main-app/students/students.component').then(
            (c) => c.StudentsComponent
          ),
        data: {
          roles: ['admin', 'faculty'],
        },
        canActivate: [roleGuard],
      },
      // student attendance : only student can access
      {
        path: 'student-attendance',
        loadComponent: () =>
          import(
            './pages/main-app/students/attendance/attendance.component'
          ).then((c) => c.AttendanceComponent),
        data: {
          role: 'student',
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
        },
        canActivate: [roleGuard],
      },
      {
        path: 'subjects',
        loadComponent: () =>
          import('./pages/main-app/subjects/subjects.component').then(
            (c) => c.SubjectsComponent
          ),
        data: {
          roles: ['admin', 'faculty', 'student'],
        },
        canActivate: [roleGuard],
      },

      {
        path: 'manager-report',
        loadComponent: () =>
          import(
            './pages/main-app/reports/manager-report/manager-report.component'
          ).then((c) => c.ManagerReportComponent),
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
