import { Query, Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { LoginResponse, RegisterResponse } from 'src/auth/auth.type';
import { LoginDto, RegisterDto } from 'src/auth/auth.dto';
import { Response, Request } from 'express';
import { BadRequestException, UseFilters } from '@nestjs/common';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';
import { User } from './models/user.model';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @UseFilters(GraphQLErrorFilter)
  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() contex: { res: Response },
  ): Promise<RegisterResponse> {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException({
        confirmPassword: 'Password or confirm password are not the same!',
      });
    }
    const { user } = await this.authService.register(registerDto, contex.res);
    return { user };
  }
  @UseFilters(GraphQLErrorFilter)
  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginDto: LoginDto,
    @Context() contex: { res: Response },
  ): Promise<LoginResponse> {
    return this.authService.login(loginDto, contex.res);
  }

  @Mutation(() => String)
  async refresh(@Context() contex: { req: Request; res: Response }) {
    try {
      return await this.authService.refreshToken(contex.req, contex.res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Mutation(() => String)
  async logout(@Context() contex: { res: Response }) {
    try {
      return await this.authService.logout(contex.res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Query(() => String)
  async hello() {
    return 'Hello World!';
  }

  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }
}
