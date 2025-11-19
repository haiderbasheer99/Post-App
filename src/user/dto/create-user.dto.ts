import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto{
    
    @IsNotEmpty({message: 'FirstName is Required'})
    @IsString({message: 'FirstName must be a String Value'})
    @MinLength(3,{message: 'FirstName should be More Than 3 charcters'})
    @MaxLength(13, {message: 'FirstName should be less Than 13 charcters'})
    firstName: string;

    @IsNotEmpty({message: 'LastName is Required'})
    @IsString({message: 'LastName must be a String Value'})
    @MinLength(3, {message: 'LastName should be More Than 3 charcters'})
    @MaxLength(13, {message: 'LastName should be less Than 13 charcters'})
    lastName: string;

    @IsNotEmpty({message: 'Email is Required'})
    @IsEmail({}, {message: 'Please Provide A valid Email'})
    email: string;

    @IsNotEmpty({message: 'Password is Required'})
    @IsString({message: 'Password must be a String Value'})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    })
    password: string;
}