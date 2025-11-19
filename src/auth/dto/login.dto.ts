import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto{

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, {message: 'Please Provide A valid Email'})
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    password: string;
}