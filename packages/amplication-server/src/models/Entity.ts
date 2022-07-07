import { Field, ObjectType } from '@nestjs/graphql';
import { EntityVersion } from './EntityVersion'; // eslint-disable-line import/no-cycle
import { EntityField } from './EntityField'; // eslint-disable-line import/no-cycle
import { User } from './User'; // eslint-disable-line import/no-cycle
import { Resource } from './Resource'; // eslint-disable-line import/no-cycle
import { EntityPermission } from './EntityPermission'; // eslint-disable-line import/no-cycle

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

  @Field(() => Resource, {
    nullable: true,
    description: undefined
  })
  resource?: Resource;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  resourceId: string;

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

  @Field(() => [EntityVersion], {
    nullable: true
  })
  versions?: EntityVersion[] | null;

  @Field(() => [EntityField], {
    nullable: true
  })
  fields?: EntityField[] | null;

  @Field(() => [EntityPermission], {
    nullable: true,
    description: undefined
  })
  permissions?: EntityPermission[] | null;

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
