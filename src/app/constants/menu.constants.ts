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
    allowedRoles: ['admin'],
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
    allowedRoles: ['admin'],
  },

  {
    label: 'MANAGE',
    isGroupTitle: true,
  },
  {
    label: 'Users',
    icon: 'bi bi-people-fill',
    route: 'users',
    allowedRoles: ['admin'],
  },

  // classes
  {
    label: 'Classes',
    icon: 'bi bi-buildings-fill',
    route: 'classes',
    allowedRoles: ['admin'],
  },
  // periods
  {
    label: 'Periods',
    icon: 'bi bi-clock-fill',
    route: 'periods',
    allowedRoles: ['admin'],
  },

  // subjects
  {
    label: 'Subjects',
    icon: 'bi bi-book-fill',
    route: 'subjects',
  },

  // faculties

  {
    label: 'faculties',
    icon: 'bi bi-mortarboard',
    route: 'faculties',
    allowedRoles: ['admin'],
  },

  // students
  {
    label: 'Students',
    icon: 'bi bi-universal-access',
    route: 'students',
    allowedRoles: ['admin'],
  },

  // countries
  {
    label: 'Countries',
    icon: 'fas fa-building',
    route: 'countries',
  },

  //study materail
  {
    label:'StudyMaterial',
    icon:'bi bi-file',
    route:'studymaterial',
  },
  
  // departments
  {
    label: 'Departments',
    icon: 'bi bi-people',
    route: 'departments',
    allowedRoles: ['admin'],
  },
  // states
  {
    label: 'States',
    icon: 'fas fa-building',
    route: 'states',
  },
  // roles
  {
    label: 'Roles',
    icon: 'fas fa-user-lock',
    route: 'roles',
    allowedRoles: ['admin'],
  },
];
