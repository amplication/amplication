import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity } from '../models/Entity'; // eslint-disable-line import/no-cycle
import { EntityField } from '../models/EntityField'; // eslint-disable-line import/no-cycle
import { Commit } from '../models/Commit'; // eslint-disable-line import/no-cycle
import { EntityPermission } from './EntityPermission'; // eslint-disable-line import/no-cycle

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class EntityVersion {
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

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  entityId: string;

  @Field(() => Entity, {
    nullable: false,
    description: undefined
  })
  entity?: Entity;

  @Field(() => Int, {
    nullable: false,
    description: undefined
  })
  versionNumber!: number;

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

  commitId?: string | null;

  @Field(() => Commit, {
    nullable: true,
    description: undefined
  })
  commit?: Commit;

  @Field(() => [EntityField], {
    nullable: false,
    description: undefined
  })
  fields?: EntityField[] | null;

  @Field(() => [EntityPermission], {
    nullable: true,
    description: undefined
  })
  permissions?: EntityPermission[] | null;
}
