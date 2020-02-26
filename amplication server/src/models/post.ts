import { Field, ObjectType } from 'type-graphql';
import { User } from './user';
import { Model } from './model';

@ObjectType()
export class Post extends Model {
  @Field(type => String)
  title: string;

  @Field(type => String)
  content: string;

  @Field(type => Boolean)
  published: boolean;

  @Field(type => User)
  author: User;
}
