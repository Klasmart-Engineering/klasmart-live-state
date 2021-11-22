import { newUserRole, UserRole } from "./models";

export const roles = {
    /** Consider using isTeacher() for comparison */
    Teacher: newUserRole("teacher"),
    /** Consider using isStudent() for comparison */
    Student: newUserRole("student"),
}

export function isTeacher({role}: {role: UserRole}) {
    return role === roles.Teacher
}

export function isStudent({role}: {role: UserRole}) {
    return role === roles.Student
}