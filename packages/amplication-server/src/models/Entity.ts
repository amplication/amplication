import { Field, ObjectType } from "@nestjs/graphql";
import { EntityVersion } from "./EntityVersion";
import { EntityField } from "./EntityField";
import { User } from "./User";
import { Resource } from "./Resource";
import { EntityPermission } from "./EntityPermission";

@ObjectType({
  isAbstract: true,
})
export class Entity {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => Date, {
    nullable: false,
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false,
  })
  updatedAt!: Date;

  @Field(() => Resource, {
    nullable: true,
  })
  resource?: Resource;

  @Field(() => String, {
    nullable: false,
  })
  resourceId: string;

  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
  })
  displayName!: string;

  @Field(() => String, {
    nullable: false,
  })
  pluralDisplayName!: string;

  @Field(() => String, {
    nullable: true,
  })
  customAttributes?: string;

  @Field(() => String, {
    nullable: true,
  })
  description?: string;

  @Field(() => [EntityVersion], {
    nullable: true,
  })
  versions?: EntityVersion[] | null;

  @Field(() => [EntityField], {
    nullable: true,
  })
  fields?: EntityField[] | null;

  @Field(() => [EntityPermission], {
    nullable: true,
  })
  permissions?: EntityPermission[] | null;

  @Field(() => String, {
    nullable: true,
  })
  lockedByUserId?: string;

  @Field(() => User, {
    nullable: true,
  })
  lockedByUser?: User;

  @Field(() => Date, {
    nullable: true,
  })
  lockedAt?: Date;
}
