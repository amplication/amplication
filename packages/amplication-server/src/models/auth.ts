import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Auth {
  @Field({ description: 'JWT Bearer token', nullable: false })
  token: string;
}
