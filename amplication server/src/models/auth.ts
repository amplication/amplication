import { Field, ObjectType } from 'type-graphql';
import { Account } from './Account';

@ObjectType()
export class Auth {
  @Field({ description: 'JWT Bearer token' })
  token: string;

  @Field(type => Account)
  account: Account;
}
