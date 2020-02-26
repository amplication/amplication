import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class PageInfo {
  @Field(type => String)
  endCursor: string;

  @Field(type => Boolean)
  hasNextPage: boolean;

  @Field(type => Boolean)
  hasPreviousPage: boolean;

  @Field(type => String)
  startCursor: string;
}
