import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    PostService,
    PostResolver,
    ConfigService,
    PrismaService,
    JwtService,
  ],
})
export class PostModule {}
