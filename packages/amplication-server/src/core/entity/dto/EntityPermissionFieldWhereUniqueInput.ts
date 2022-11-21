import { Field, InputType } from "@nestjs/graphql";
import { EnumEntityAction } from "../../../enums/EnumEntityAction";

@InputType({
  isAbstract: true,
})
export class EntityPermissionFieldWhereUniqueInput {
  @Field(() => String, {
    nullable: false,
  })
  entityId: string;

  @Field(() => EnumEntityAction, {
    nullable: false,
  })
  action!: keyof typeof EnumEntityAction;

  @Field(() => String, {
    nullable: false,
  })
  fieldPermanentId!: string;
}
