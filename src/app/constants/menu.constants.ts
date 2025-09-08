import { MenuItem } from '../interfaces/menu-item.interface';

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'bi bi-house-door-fill',
    route: 'dashboard',
  },
  {
    label: 'Reports',
    // icon: 'fas fa-chart-line',
    icon: 'bi bi-bar-chart-fill',
    children: [
      {
        label: 'Manager Report',
        icon: 'bi bi-bar-chart-line',
        route: 'manager-report',
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

  // subjects
  {
    label: 'Subjects',
    icon: 'bi bi-book-fill',
    route: 'subjects',
  },
  // students
  {
    label: 'Students',
    icon: 'bi bi-universal-access',
    route: 'students',
    allowedRoles: ['admin'],
  },
  {
    label: 'Countries',
    icon: 'fas fa-building',
    route: 'countries',
  },

  {
    label: 'States',
    icon: 'fas fa-building',
    route: 'states',
  },
  {
    label: 'Roles',
    icon: 'fas fa-user-lock',
    route: 'roles',
    allowedRoles: ['admin'],
  },
];
