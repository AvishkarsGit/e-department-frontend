import { MenuItem } from '../interfaces/menu-item.interface';

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'bi bi-house-door-fill',
    route: 'dashboard',
  },

  // attendance

  {
    label: 'Attendance',
    icon: 'bi bi-file-earmark-spreadsheet-fill',
    route: 'attendances',
    allowedRoles: ['admin', 'faculty'],
  },
  {
    label: 'Reports',
    // icon: 'fas fa-chart-line',
    icon: 'bi bi-bar-chart-fill',
    children: [
      // summaries
      {
        label: 'Attendance Summary',
        icon: 'bi bi-file-person-fill',
        route: 'summaries',
      },
    ],
    allowedRoles: ['admin', 'faculty'],
  },

  {
    label: 'MANAGE',
    isGroupTitle: true,
    allowedRoles: ['admin', 'faculty'],
  },
  // departments
  {
    label: 'Departments',
    icon: 'bi bi-people',
    route: 'departments',
    allowedRoles: ['admin'],
  },
  // classes
  {
    label: 'Classes',
    icon: 'bi bi-buildings-fill',
    route: 'classes',
    allowedRoles: ['admin'],
  },

  // faculties
  {
    label: 'Faculties',
    icon: 'bi bi-person-workspace',
    route: 'faculties',
    allowedRoles: ['admin'],
  },

  // students
  {
    label: 'Students',
    icon: 'bi bi-mortarboard-fill',
    route: 'students',
    allowedRoles: ['admin', 'faculty'],
  },
  // student attendance : only student can access
  {
    label: 'Attendance',
    icon: 'bi bi-file-earmark-spreadsheet-fill',
    route: 'student-attendance',
    allowedRoles: ['student'],
  },
  // upload material
  {
    label: 'Study Material',
    icon: 'bi bi-journal-text',
    route: 'uploads',
    allowedRoles: ['admin', 'faculty','student'],
  },

  // subjects
  {
    label: 'Subjects',
    icon: 'bi bi-book-fill',
    route: 'subjects',
    allowedRoles: ['admin', 'faculty', 'student'],
  },
  // periods
  {
    label: 'Periods',
    icon: 'bi bi-clock-fill',
    route: 'periods',
    allowedRoles: ['admin'],
  },
];
