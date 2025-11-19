import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ActiveUser } from "src/interfaces/activeUser.interface";

export const CurrentUser = createParamDecorator(
    (field: keyof ActiveUser | undefined, ctx: ExecutionContext)=>{
        const request = ctx.switchToHttp().getRequest();
        const user: ActiveUser = request.user
        return field? user?.[field] : user 

    }
)