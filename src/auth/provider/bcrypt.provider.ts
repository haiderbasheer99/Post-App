import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt'

@Injectable()
export class BcryptProvider implements HashingProvider {
    async hashPassword(plainPassword: string): Promise<string> {

        let salt = await bcrypt.genSalt();

        return await bcrypt.hash(plainPassword, salt);
    }

    async comparePassword( plainPassword: string, hashedPassword: string): Promise<boolean> {
        
        return bcrypt.compare(plainPassword, hashedPassword)
    }
}
