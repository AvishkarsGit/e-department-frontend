import { Class } from "./class.interface";
import { Faculty } from "./faculty.interface";
import { Subject } from "./subject.interface";

export interface Studymaterial{
_id:string,
title:string,
subject_id:string,
subject:Subject,

faculty_id:string,
faculty:Faculty,

class_id:string,
class:Class
}