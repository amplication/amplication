import { EnumEntityAction } from "../../../enums/EnumEntityAction";
import { Field, InputType } from "@nestjs/graphql";

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
