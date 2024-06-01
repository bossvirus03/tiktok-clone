import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getUsers() {
    return this.prisma.user.findMany({
      include: {
        posts: true,
      },
    });
  }
}
