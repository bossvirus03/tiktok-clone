import { Module } from '@nestjs/common';
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';
import { PrismaService } from 'src/prisma.service';
import { GraphqlAuthGuard } from 'src/auth/guards/graphql-auth.guard';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    LikeService,
    LikeResolver,
    PrismaService,
    GraphqlAuthGuard,
    ConfigService,
    JwtService,
  ],
})
export class LikeModule {}
