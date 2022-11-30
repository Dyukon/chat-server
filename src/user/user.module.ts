import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaService } from '../lib/services/prisma.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from '../lib/configs/jwt.config'
import { JwtStrategy } from '../lib/strategies/jwt.strategy'

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig
    })
  ],
  providers: [
    PrismaService,
    UserResolver,
    UserService,
    JwtStrategy
  ]
})
export class UserModule {}
