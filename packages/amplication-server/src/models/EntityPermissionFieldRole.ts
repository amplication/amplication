import { Field, ObjectType } from "@nestjs/graphql";
import { EntityPermissionField } from "./EntityPermissionField";
import { EntityPermissionRole } from "./EntityPermissionRole";

@ObjectType({
  isAbstract: true,
})
export class EntityPermissionFieldRole {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => String, {
    nullable: false,
  })
  entityPermissionFieldId!: string;

  @Field(() => EntityPermissionField, {
    nullable: true,
  })
  entityPermissionField?: EntityPermissionField;

  @Field(() => String, {
    nullable: false,
  })
  entityPermissionRoleId!: string;

  @Field(() => EntityPermissionRole, {
    nullable: true,
  })
  entityPermissionRole?: EntityPermissionRole;
}
