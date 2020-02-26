import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { Post } from './post';
import { Model } from './model';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role'
});

@ObjectType()
export class User extends Model {
  @Field(type => String)
  email: string;

  @Field(type => String, { nullable: true })
  firstname?: string;

  @Field(type => String, { nullable: true })
  lastname?: string;

  @Field(type => Role)
  role: Role;

  @Field(type => [Post])
  posts: Post[];

  password: string;
}
