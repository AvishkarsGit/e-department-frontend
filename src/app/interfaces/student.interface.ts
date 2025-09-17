import { Class } from './class.interface';
import { Guardian } from './guardian.interface';
import { User } from './user.interface';

export interface Student {
  _id: string;
  user_id: string;
  user: User;
  class_id: string;
  classData: Class;
  created_at: Date;
  updated_at: Date;
  //guardian / parents detail
  guardian: Guardian[];
}
