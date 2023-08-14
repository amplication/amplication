import { Field, ObjectType } from "@nestjs/graphql";
import { EntityPermission } from "./EntityPermission";
import { EntityField } from "./EntityField";
import { EntityPermissionRole } from "./EntityPermissionRole";

/**
 * Defines a set of {@linkcode EntityPermissionRole} allowed to perform an
 * action on {@linkcode EntityField}.
 */
@ObjectType({
  isAbstract: true,
})
export class EntityPermissionField {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => String, {
    nullable: false,
  })
  permissionId!: string;

  @Field(() => EntityPermission, {
    nullable: true,
  })
  permission?: EntityPermission;

  @Field(() => String, {
    nullable: false,
  })
  fieldPermanentId!: string;

  @Field(() => String, {
    nullable: false,
  })
  entityVersionId!: string;

  @Field(() => EntityField, {
    nullable: false,
  })
  field: EntityField;

  @Field(() => [EntityPermissionRole], {
    nullable: true,
  })
  permissionRoles?: EntityPermissionRole[];
}
