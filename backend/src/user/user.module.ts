import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  providers: [
    UserResolver,
    UserService,
    AuthService,
    JwtService,
    PrismaService,
  ],
})
export class UserModule {}
