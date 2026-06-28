import { Class } from './class.interface';

export interface Subject {
  _id: string;
  name: string;
  code: string;
  class_id: string;
  created_at?: Date;
  updated_at?: Date;

  //class
  classData: Class;
}
