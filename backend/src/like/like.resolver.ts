import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { LikeService } from './like.service';

import { Request } from 'express';
import { Like } from './models/like.model';
import { GraphqlAuthGuard } from 'src/auth/guards/graphql-auth.guard';

@Resolver()
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @Mutation(() => Like)
  @UseGuards(GraphqlAuthGuard)
  async likePost(
    @Args('postId') postId: number,
    @Context() ctx: { req: Request },
  ) {
    return this.likeService.likePost({
      userId: ctx.req.user.sub,
      postId: postId,
    });
  }

  @Mutation(() => Like)
  @UseGuards(GraphqlAuthGuard)
  async unlikePost(
    @Args('postId') postId: number,
    @Context() ctx: { req: Request },
  ) {
    return this.likeService.unlikePost(postId, ctx.req.user.sub);
  }
}
