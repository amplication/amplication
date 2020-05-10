import { Field, ObjectType } from '@nestjs/graphql';
import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveProperty,
  Resolver,
  Root
} from '@nestjs/graphql';
import { Entity } from './Entity';
import { Organization } from './Organization';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class Project {
  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  id!: string;

  @Field(_type => Date, {
    nullable: false,
    description: undefined
  })
  createdAt!: Date;

  @Field(_type => Date, {
    nullable: false,
    description: undefined
  })
  updatedAt!: Date;

  organization?: Organization;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  entity?: Entity[] | null;
}
