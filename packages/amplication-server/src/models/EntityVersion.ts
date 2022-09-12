import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity } from '../models/Entity'; // eslint-disable-line import/no-cycle
import { EntityField } from '../models/EntityField'; // eslint-disable-line import/no-cycle
import { Commit } from '../models/Commit'; // eslint-disable-line import/no-cycle
import { EntityPermission } from './EntityPermission'; // eslint-disable-line import/no-cycle

@ObjectType({
  isAbstract: true
})
export class EntityVersion {
  @Field(() => String, {
    nullable: false
  })
  id!: string;

  @Field(() => Date, {
    nullable: false
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false
  })
  updatedAt!: Date;

  @Field(() => String, {
    nullable: false
  })
  entityId: string;

  @Field(() => Entity, {
    nullable: false
  })
  entity?: Entity;

  @Field(() => Int, {
    nullable: false
  })
  versionNumber!: number;

  @Field(() => String, {
    nullable: false
  })
  name!: string;

  @Field(() => String, {
    nullable: false
  })
  displayName!: string;

  @Field(() => String, {
    nullable: false
  })
  pluralDisplayName!: string;

  @Field(() => String, {
    nullable: true
  })
  description?: string;

  commitId?: string | null;

  @Field(() => Commit, {
    nullable: true
  })
  commit?: Commit;

  @Field(() => [EntityField], {
    nullable: false
  })
  fields?: EntityField[] | null;

  @Field(() => [EntityPermission], {
    nullable: true
  })
  permissions?: EntityPermission[] | null;
}
