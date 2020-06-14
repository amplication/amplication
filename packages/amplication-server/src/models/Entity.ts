import { Field, ObjectType } from '@nestjs/graphql';
import { EntityVersion, EntityField } from './';
import { App } from './App';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class Entity {
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

  App?: App;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  displayName!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  pluralDisplayName!: string;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  description?: string;

  @Field(() => Boolean, {
    nullable: false,
    description: undefined
  })
  isPersistent!: boolean;

  @Field(() => Boolean, {
    nullable: false,
    description: undefined
  })
  allowFeedback!: boolean;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  primaryField?: string;

  entityVersions?: EntityVersion[] | null;

  @Field(() => [EntityField], {
    nullable: false,
    description: undefined
  })
  fields?: EntityField[] | null;

  @Field(() => Number, {
    nullable: true,
    description: undefined
  })
  versionNumber?: number;
}
