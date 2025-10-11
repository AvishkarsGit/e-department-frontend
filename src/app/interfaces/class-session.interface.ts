export interface ClassSession {
  _id: string;
  class_id: string;
  subject_id: string;
  faculty_id: string;
  period: string;
  date: Date;
  criteria?:number,
  created_at: Date;
  updated_at: Date;

}
