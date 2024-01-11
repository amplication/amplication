import { EnumEntityAction } from "../../../enums/EnumEntityAction";
import { EnumEntityPermissionType } from "../../../enums/EnumEntityPermissionType";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class EntityUpdatePermissionInput {
  @Field(() => EnumEntityAction, { nullable: false })
  action!: EnumEntityAction;

  @Field(() => EnumEntityPermissionType, { nullable: false })
  type!: EnumEntityPermissionType;
}
