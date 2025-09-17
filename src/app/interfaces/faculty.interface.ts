import { Subject } from "./subject.interface";

export interface faculty{
    _id:string;
    user_id:string;
    department_id:string;
    assigned_class:string;
    subjects:Subject[];
    created_at?:Date;
    updated_at?:Date;
}