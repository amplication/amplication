import { Field, ObjectType } from "@nestjs/graphql";
import { EntityVersion } from "./EntityVersion";
import { EntityPermissionRole } from "./EntityPermissionRole";
import { EntityPermissionField } from "./EntityPermissionField";
import { EnumEntityAction } from "./../enums/EnumEntityAction";
import { EnumEntityPermissionType } from "./../enums/EnumEntityPermissionType";

/**
 * Defines a set of {@linkcode EntityPermissionRole} allowed to perform an
 * {@linkcode EnumEntityAction} on {@linkcode EntityVersion}. It defines the
 * default access permissions for the entity and its fields, and permissions
 * for specific fields.
 */
@ObjectType({
  isAbstract: true,
})
export class EntityPermission {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => String, {
    nullable: false,
  })
  entityVersionId!: string;

  @Field(() => EntityVersion, {
    nullable: true,
  })
  entityVersion?: EntityVersion;

  @Field(() => EnumEntityAction, {
    nullable: false,
  })
  action!: keyof typeof EnumEntityAction;

  @Field(() => EnumEntityPermissionType, {
    nullable: false,
  })
  type!: keyof typeof EnumEntityPermissionType;

  @Field(() => [EntityPermissionRole], {
    nullable: true,
  })
  permissionRoles?: EntityPermissionRole[] | null;

  @Field(() => [EntityPermissionField], {
    nullable: true,
  })
  permissionFields?: EntityPermissionField[] | null;
}
