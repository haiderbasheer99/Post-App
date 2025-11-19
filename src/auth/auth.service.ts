import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { HashingProvider } from './provider/hashing.provider';
import AuthConfig from './config/auth.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from 'src/user/entities/user.entity';
import { ActiveUser } from 'src/interfaces/activeUser.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly hashingProvider: HashingProvider,
        private readonly userService: UserService,

        @Inject(AuthConfig.KEY)
        private readonly authConfig: ConfigType<typeof AuthConfig>,
        private readonly jwtService: JwtService
    ) {}

    async registerUser(createUserDto: CreateUserDto) {
        try {
            return await this.userService.createUser(createUserDto);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    async registerAdmin(createUserDto: CreateUserDto) {
        try {
            return await this.userService.createAdminUser(createUserDto);
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    async loginUser(loginDto: LoginDto) {
        try {
            let compare: boolean = false;

            const user = await this.userService.findUserByEmail(loginDto.email);
            if (!user) {
                throw new NotFoundException('There Is NO User With This Email');
            }

            compare = await this.hashingProvider.comparePassword(loginDto.password, user.password)
            if (!compare) {
                throw new ConflictException('Wrong Password, Please Provide Correct One');
            }
            const { password, ...result } = user

            const token = await this.signToken<Partial<ActiveUser>>(user.id, this.authConfig.expiresIn, { email: user.email, role: user.role });

            const refreshToken = await this.signToken(user.id, this.authConfig.refreshTokenExpiresIn);
            
            return {
                user: result,
                token,
                refreshToken,
                message: 'You Are Logged In succsessfuly'
            }
        } catch (error) {
            if (error.status === 404) {
                throw new NotFoundException(error.response)
            }
            if (error.status === 409) {
                throw new ConflictException(error.response)
            }
            throw new BadRequestException(error.response)
        }
    }

    private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
        return await this.jwtService.signAsync({
            sub: userId,
            ...payload
        }, {
            secret: this.authConfig.secret,
            expiresIn
        })
    }

    public async generateToken(user: User) {
        const accessToken = await this.signToken<Partial<ActiveUser>>(user.id, this.authConfig.expiresIn, { email: user.email, role: user.role })

        const refreshToken = await this.signToken(user.id, this.authConfig.refreshTokenExpiresIn);

        return {
            id: user.id,
            accessToken,
            refreshToken
        }
    }

    public async refreshToken(token: string) {
        try {
            const{sub} = await this.jwtService.verify(token, { secret: this.authConfig.secret });

            const user = await this.userService.findUserById(sub);
            if(!user){
                throw new UnauthorizedException('Invalid Token no user')
            }
            return await this.generateToken(user);

        } catch (error) {
            throw new BadRequestException(error)
        }

    }
    public async finduser(id: number){
        try {
            return await this.userService.findUserById(id);
        } catch (error) {
            throw new NotFoundException(`There is No User With This ID ${id}`);
        }
    }
}
