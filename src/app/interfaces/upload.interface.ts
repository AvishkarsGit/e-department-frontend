import { Subject } from "./subject.interface";
import { User } from "./user.interface";

export interface Upload {
  _id?: string;
  title: string;
  class_id: string;
  upload_type: string;
  uploaded_url: string;
  uploaded_at: Date;
  //ref
  uploaded_by: User;
  subject_id: Subject
}
