import { UserRole } from "./models";
export declare const roles: {
    /** Consider using isTeacher() for comparison */
    Teacher: UserRole;
    /** Consider using isStudent() for comparison */
    Student: UserRole;
};
export declare function isTeacher({ role }: {
    role: UserRole;
}): boolean;
export declare function isStudent({ role }: {
    role: UserRole;
}): boolean;
//# sourceMappingURL=roles.d.ts.map