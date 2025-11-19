import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashingProvider } from './provider/hashing.provider';
import { BcryptProvider } from './provider/bcrypt.provider';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import AuthConfig from './config/auth.config'
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './guard/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
@Module({
  controllers: [AuthController],
  providers: [AuthService, {
    provide: HashingProvider,
    useClass: BcryptProvider
  },  RolesGuard, JwtStrategy],
  imports: [
    forwardRef(() => UserModule),
    ConfigModule.forFeature(AuthConfig),
    JwtModule.registerAsync(AuthConfig.asProvider())
  ],
  exports: [AuthService, HashingProvider ]
})
export class AuthModule {}
