import { Field, InputType } from "@nestjs/graphql";
import { EnumEntityAction } from "../../../enums/EnumEntityAction";

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
