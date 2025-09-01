export type Role = 'admin'| 'hod' | 'faculty' | 'student';

export interface User {
  _id: string;
  role: Role;
  name: string;
  email: string;
  phone: string;
  account_status: boolean;
  photo?: any;
  created_at?: Date;
  updated_at?: Date;
}
