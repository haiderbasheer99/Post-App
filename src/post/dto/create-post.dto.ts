import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePostDto{

    @IsNotEmpty({message: 'title should not be empty'})
    @IsString({message: 'title must be string'})
    @MinLength(3,{message: 'title can not be less than 3 charc'})
    @MaxLength(50,{message: 'title can not be longer than 50 charc'})
    title: string;

    @IsNotEmpty({message: 'content should not be empty'})
    @IsString({message: 'content must be string'})
    @MinLength(3,{message: 'content can not be less than 3 charc'})
    content: string;

    // @IsNotEmpty({message: 'authorName should not be empty'})
    // @IsString({message: 'authorName must be string'})
    // @MinLength(2,{message: 'authorName can not be less than 2 charc'})
    // @MaxLength(25,{message: 'authorName can not be longer than 25 charc'})
    // authorName: string;

}