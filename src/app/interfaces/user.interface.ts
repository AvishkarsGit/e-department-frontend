import { Class } from './class.interface';
import { Department } from './department.interface';
import { Guardian } from './guardian.interface';
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
  rollNo?: number;
  subjects?: Subject[];
  guardian?: Guardian[];
  classData?: Class;
  created_at?: Date;
  updated_at?: Date;
}
