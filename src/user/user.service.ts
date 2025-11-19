import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/provider/hashing.provider';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider
    ) { }

    public async createUser(createUserDto: CreateUserDto) {
        try {
            const existingUser = await this.userRepository.findOne({
                where: { email: createUserDto.email }
            });

            if (existingUser) {
                throw new ConflictException('There is Already Existing User With This Email');
            }

            const newUser = this.userRepository.create({
                ...createUserDto,
                password: await this.hashingProvider.hashPassword(createUserDto.password),
                role: UserRole.USER
            });
            await this.userRepository.save(newUser);
            const { password, ...safeUser } = newUser;

            return safeUser;

        } catch (error) {
            if (error.status === 409) {
                throw new ConflictException(error.response)
            }
            throw new BadRequestException(error.response)
        }

    }

    public async createAdminUser(createUserDto: CreateUserDto) {
        try {
            const existingUser = await this.userRepository.findOne({
                where: { email: createUserDto.email }
            });

            if (existingUser) {
                throw new ConflictException('There is Already Existing User With This Email');
            }

            const adminUser = this.userRepository.create({
                ...createUserDto,
                password: await this.hashingProvider.hashPassword(createUserDto.password),
                role: UserRole.ADMIN
            });

            await this.userRepository.save(adminUser);
            const { password, ...safeUser } = adminUser;

            return safeUser;

        } catch (error) {
            if (error.status === 409) {
                throw new ConflictException(error.response);
            }
            throw new BadRequestException(error.response);
        }

    }

    async findUserByEmail(email: string) {
        try {
            const user = await this.userRepository.findOneBy({ email });
            if (!user) {
                throw new NotFoundException('There Is NO User With This Email');
            }
            return user;
        } catch (error) {
            throw new NotFoundException(error.response);
        }
    }

    async findUserById(id: number) {
        try {
            const user = await this.userRepository.findOneBy({ id });
            if (!user) {
                throw new NotFoundException('There Is NO User With This id');
            }
            return user;
        } catch (error) {
            throw new NotFoundException(error.response);
        }

    }
}
