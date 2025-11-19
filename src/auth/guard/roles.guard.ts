import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "src/user/entities/user.entity";
import { ROLES_KEY } from "../decorators/roles.decorator";


@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) { }
     canActivate(context: ExecutionContext): boolean {

        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]
        )
        if (!requiredRoles) {
            return true
        }

            const { user } = context.switchToHttp().getRequest();
            if(!user){
                throw new ForbiddenException('User is not Authenticated')
            }

            const hasRequiredRole = requiredRoles.some((role) => user.role === role);
            if(!hasRequiredRole){
                throw new ForbiddenException('You Dont have The Permission ')
            }

            return true
    
    }
}