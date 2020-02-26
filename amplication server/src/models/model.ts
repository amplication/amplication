import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType({ isAbstract: true })
export abstract class Model {
  @Field(type => ID)
  id: string;

  @Field(type => Date)
  createdAt: Date;

  @Field(type => Date)
  updatedAt: Date;
}
