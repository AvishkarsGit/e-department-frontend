import { Department } from "./department.interface";

export type Year = 1 | 2 | 3 | 4;
export type Semester = 1 | 2;
export interface Class {
  _id?: string;
  department_id: string;
  year: number;
  semester: number;
  
  department?: Department;

}

