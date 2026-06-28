import { Subject } from './subject.interface';

export interface StudentRecord {
  subject_id: string;
  student_id: string;
  class_id: string;
  subject?: Subject;
  status?:string,
  date?:Date,
  period_text?:string;

}
