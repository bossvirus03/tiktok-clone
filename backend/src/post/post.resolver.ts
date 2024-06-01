/* eslint-disable @typescript-eslint/no-var-requires */
import { Resolver, Query, Mutation, Args, Context, Int } from '@nestjs/graphql';
import { PostService } from './post.service';

import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
// ('graphql-upload/Upload.mjs');
import { Request } from 'express';
import { UseFilters, UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/guards/graphql-auth.guard';
import { Post, PostDetails } from './model/post.model';
// import { FileUpload } from 'src/file/file.interface';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';
@Resolver('Post')
export class PostResolver {
  constructor(private readonly postService: PostService) {}
  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Post)
  async createPost(
    @Context() context: { req: Request },
    @Args({ name: 'video', type: () => GraphQLUpload }) video: any,
    @Args('text') text: string,
  ) {
    const userId = context.req.user.sub;
    console.log('userId!', userId);
    const videoPath = await this.postService.saveVideo(video);

    // Create the post
    const postData = {
      text,
      video: videoPath,
      user: { connect: { id: userId } },
    };

    return await this.postService.createPost(postData);
  }
  @Query(() => PostDetails)
  async getPostById(@Args('id') id: number) {
    return await this.postService.getPostById(id);
  }
  @Query(() => [Post])
  async getPosts(
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 1 }) take: number,
  ): Promise<Post[]> {
    console.log('skip!', skip, 'take!', take);
    return await this.postService.getPosts(skip, take);
  }

  @Mutation(() => Post)
  async deletePost(@Args('id') id: number) {
    return await this.postService.deletePost(id);
  }

  // get all the posts of a user
  @Query(() => [Post])
  async getPostsByUserId(@Args('userId') userId: number) {
    return await this.postService.getPostsByUserId(userId);
  }
}
