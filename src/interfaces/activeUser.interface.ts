import { UserRole } from "src/user/entities/user.entity";

export interface ActiveUser{
    sub: number,
    email: string,
    role: UserRole
}