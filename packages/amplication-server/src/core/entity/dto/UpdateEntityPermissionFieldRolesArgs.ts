import { EntityUpdatePermissionFieldRolesInput } from "./EntityUpdatePermissionFieldRolesInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class UpdateEntityPermissionFieldRolesArgs {
  @Field(() => EntityUpdatePermissionFieldRolesInput, { nullable: false })
  data!: EntityUpdatePermissionFieldRolesInput;
}
