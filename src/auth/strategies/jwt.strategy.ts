import { BadRequestException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import AuthConfig from '../config/auth.config';
import { ConfigType } from "@nestjs/config";
import { ActiveUser } from "src/interfaces/activeUser.interface";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authservice: AuthService,
        @Inject(AuthConfig.KEY)
        private readonly authConfig: ConfigType<typeof AuthConfig>,
    ) {
        if(!authConfig.secret){
            throw new BadRequestException('JWT secret is not defined in AuthConfig')
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: authConfig.secret
        })
    }

    async validate(payload: ActiveUser){
        try {
            const user = await this.authservice.finduser(payload.sub);
            if(!user){
                throw new UnauthorizedException('You Are Not Autherized')
            }
            return{
                sub: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: payload.role
            }
        } catch (error) {
            throw new UnauthorizedException('Invalid Token')
        }
    }
    

} 