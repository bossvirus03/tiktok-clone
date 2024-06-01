import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Post } from 'src/post/model/post.model';
import { User } from 'src/user/models/user.model';

@ObjectType()
export class Comment {
  @Field(() => Int)
  id: number;

  @Field(() => User)
  user: User;

  @Field(() => Post)
  post: Post;

  @Field()
  text: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
