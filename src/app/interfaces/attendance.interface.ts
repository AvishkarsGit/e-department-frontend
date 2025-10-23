export interface Attendance {
  _id: string;
  class_id: string;
  subject_id: string;
  student_id: string;
  taken_by: string;
  date: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
}
