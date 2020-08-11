import { Field, ObjectType } from '@nestjs/graphql';
import { EntityVersion } from './EntityVersion'; // eslint-disable-line import/no-cycle
import { EntityField } from './EntityField'; // eslint-disable-line import/no-cycle
import { User } from './User'; // eslint-disable-line import/no-cycle
import { App } from './App'; // eslint-disable-line import/no-cycle

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

  @Field(() => [EntityVersion], {
    nullable: false
  })
  entityVersions?: EntityVersion[] | null;

  @Field(() => [EntityField], {
    nullable: false,
    description: undefined
  })
  fields?: EntityField[] | null;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  lockedByUserId?: string;

  @Field(() => User, {
    nullable: true,
    description: undefined
  })
  lockedByUser?: User;

  @Field(() => Date, {
    nullable: true,
    description: undefined
  })
  lockedAt?: Date;
}
