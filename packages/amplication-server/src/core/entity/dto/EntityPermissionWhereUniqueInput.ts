import { EnumEntityAction } from "../../../enums/EnumEntityAction";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class EntityPermissionWhereUniqueInput {
  @Field(() => EnumEntityAction, {
    nullable: false,
  })
  action!: keyof typeof EnumEntityAction;

  @Field(() => String, {
    nullable: false,
  })
  resourceRoleId!: string;
}
