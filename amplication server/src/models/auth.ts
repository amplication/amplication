import { Field, ObjectType } from 'type-graphql';
import { User } from './user';

@ObjectType()
export class Auth {
  @Field({ description: 'JWT Bearer token' })
  token: string;

  @Field(type => User)
  user: User;
}
