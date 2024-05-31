import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './stratergies/local.stratergy';
import { JwtStrategy } from './stratergies/jwt.stratergy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secretOrPrivateKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRES'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    PrismaService,
    ConfigService,
    LocalStrategy,
    JwtStrategy,
    JwtService,
  ],
  exports: [JwtService, AuthService, AuthModule],
})
export class AuthModule {}
