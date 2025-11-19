import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';
import { Post } from './post/entities/post.entity';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import envValidation from './config/env.validation';
import AuthConfig from 'src/auth/config/auth.config'
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      validationSchema: envValidation
    }),
    TypeOrmModule.forRootAsync({
    imports:[ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>({
      type:'postgres',
      host: configService.get('databaseConfig.host'),
      port: configService.get('databaseConfig.port'),
      username: configService.get('database.username'),
      password: configService.get('database.password'),
      database: configService.get('database.name'),
      synchronize: configService.get('database.syncronize'),
      entities: [Post, User],
    })
  }), 
  PostModule, 
  AuthModule, 
  UserModule,
  ConfigModule.forFeature(AuthConfig),
  JwtModule.registerAsync(AuthConfig.asProvider())
],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
