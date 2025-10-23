import { Department } from "./department.interface";
import { Subject } from "./subject.interface";
import { User } from "./user.interface";

export interface Faculty {
    _id: string,
    user_id: string,
    user: User,
    department_id: string,
    department: Department,
    created_at: Date,
    update_at: Date,

    //subject array store data
    subjects: Subject[],
}