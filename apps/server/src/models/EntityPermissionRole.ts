import { Field, ObjectType } from "@nestjs/graphql";
import { EntityPermission } from "./EntityPermission";
import { ResourceRole } from "./ResourceRole";
import { EnumEntityAction } from "../enums/EnumEntityAction";

/**
 * Connecting {@codelink EntityPermission} to {@codelink ResourceRole}.
 * Defines an ID so fields EntityPermissionRole can link to it.
 */
@ObjectType({
  isAbstract: true,
})
export class EntityPermissionRole {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => String, {
    nullable: false,
  })
  entityVersionId!: string;

  @Field(() => EnumEntityAction, {
    nullable: false,
  })
  action!: keyof typeof EnumEntityAction;

  @Field(() => EntityPermission, {
    nullable: true,
  })
  entityPermission?: EntityPermission;

  @Field(() => String, {
    nullable: false,
  })
  resourceRoleId!: string;

  @Field(() => ResourceRole, {
    nullable: false,
  })
  resourceRole: ResourceRole;
}
