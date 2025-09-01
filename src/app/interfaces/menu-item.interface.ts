import { Role } from "./user.interface";

export interface MenuItem {
  label: string;
  icon?: string;
  route?: string;
  // submenu?: MenuItem[];
  // isHeader?: boolean;
  // isSubHeader?: boolean;
  children?: MenuItem[];
  isGroupTitle?: boolean;
  isSectionTitle?: boolean;
  allowedRoles?: Role[];
}
