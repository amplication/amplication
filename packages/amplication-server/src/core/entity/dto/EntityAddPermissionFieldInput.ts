import { WhereParentIdInput } from "../../../dto";
import { EnumEntityAction } from "../../../enums/EnumEntityAction";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class EntityAddPermissionFieldInput {
  @Field(() => EnumEntityAction, { nullable: false })
  action!: EnumEntityAction;

  @Field(() => String, {
    nullable: false,
  })
  fieldName: string;

  @Field(() => WhereParentIdInput, {
    nullable: false,
  })
  entity!: WhereParentIdInput;
}
