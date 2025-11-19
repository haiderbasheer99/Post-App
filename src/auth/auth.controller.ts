import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { CurrentUser } from './decorators/active-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guard/roles.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Post('register')
    async registerUser(@Body() createUserDto: CreateUserDto){
        return this.authService.registerUser(createUserDto);
    }


    @Post('register-admin')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async registerAdmin(@Body() createUserDto: CreateUserDto){
        return this.authService.registerAdmin(createUserDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto){
        return await this.authService.loginUser(loginDto);
    }

    @Post('refreshToken')
    async refreshToken(@Body('token') token: string){
        return this.authService.refreshToken(token);
    }

}
