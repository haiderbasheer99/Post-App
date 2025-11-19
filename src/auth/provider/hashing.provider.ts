import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {

    abstract hashPassword(plainPassword: string ):Promise<string>;

    abstract comparePassword(plainPassword:string, hashedPassword: string): Promise<boolean>
}
