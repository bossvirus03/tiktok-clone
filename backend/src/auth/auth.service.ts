import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import { User } from 'src/user/entities/user.entity';
import { LoginDto, RegisterDto } from './auth.dto';

dayjs.extend(utc);
dayjs.extend(duration);

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}
  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found!');
    }
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token!');
    }
    const userExits = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    if (!userExits) {
      throw new UnauthorizedException('User no longer exists!');
    }
    const expiresIn = this.configService.get('ACCESS_TOKEN_EXPIRES');

    const days = parseInt(expiresIn.replace('d', ''), 10);

    const nowUTC = dayjs().utc();

    const futureUTC = nowUTC.add(dayjs.duration({ days: days }));

    futureUTC.format();
    const expiration = nowUTC + futureUTC.format();
    const accessToken = this.jwtService.sign(
      { ...payload, exp: expiration },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      },
    );
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
    });
    return accessToken;
  }

  private async issueTokens(user: User, response: Response): Promise<any> {
    const payload = { username: user.fullname, sub: user.id };
    const accessToken = this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES'),
      },
    );
    const refreshToken = this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES'),
      },
    );

    response.cookie('access_token', accessToken, {
      httpOnly: true,
    });
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
    });
    return {
      user,
    };
  }
  async validateUser(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });
    if (user && bcrypt.compare(loginDto.password, user.password)) {
      return user;
    }
    return null;
  }

  async register(registerDto: RegisterDto, response: Response) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });
    if (existingUser) {
      throw new BadRequestException({ email: 'email already exists!' });
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        fullname: registerDto.fullname,
        email: registerDto.email,
        password: hashedPassword,
      },
    });
    return this.issueTokens(user, response);
  }

  async login(loginDto: LoginDto, response: Response) {
    const user = await this.validateUser(loginDto);
    if (!user) {
      throw new BadRequestException({
        invalidCredentials: 'Invalid credentials!',
      });
    }
    return this.issueTokens(user, response);
  }

  async logout(response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    return {
      message: 'Logged out successfully!',
    };
  }
}
