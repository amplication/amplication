import { Field, ObjectType } from '@nestjs/graphql';
import { Entity } from './Entity';
import { Organization } from './Organization';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class App {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  id!: string;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  updatedAt!: Date;

  organization?: Organization;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  description!: string;

  @Field(() => [Entity], {
    nullable: false,
    description: undefined
  })
  entities?: Entity[];
}
