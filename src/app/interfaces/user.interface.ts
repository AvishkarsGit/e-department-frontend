import { Department } from './department.interface';
import { Subject } from './subject.interface';

export type Role = 'admin' | 'faculty' | 'student';

export interface User {
  _id: string;
  role: Role;
  name: string;
  email: string;
  phone: string;
  username: string;
  account_status: boolean;
  email_verified: string;
  photo?: string;
  subjects?: Subject[];
  department?: Department;
  created_at?: Date;
  updated_at?: Date;
}
