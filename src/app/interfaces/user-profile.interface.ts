import { Guardian } from "./guardian.interface";
import { Subject } from "./subject.interface";

export interface UserProfile {
  _id:string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  username: string;
  createdAt: Date;
  role: string;
  rollNo?:number;
  semester?:number;
  year?:number;
  department: string;
  emailVerified: string;
  guardians?: Guardian[];
  class?: string;
  subjects?: Subject[];
}
