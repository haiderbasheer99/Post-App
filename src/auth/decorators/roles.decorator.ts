import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/user/entities/user.entity";


export const ROLES_KEY = 'roles';

//...roles  because i can take one role or more like -> @Role('USER_ROLE.admin', 'USER_ROLE.user')
//if no spread Operator then (role: UserRole)
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles); 