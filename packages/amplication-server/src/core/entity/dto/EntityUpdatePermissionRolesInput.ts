import { Field, InputType } from "@nestjs/graphql";
import { EnumEntityAction } from "../../../enums/EnumEntityAction";
import { WhereParentIdInput, WhereUniqueInput } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class EntityUpdatePermissionRolesInput {
  @Field(() => EnumEntityAction, { nullable: false })
  action!: EnumEntityAction;

  @Field(() => WhereParentIdInput, {
    nullable: false,
  })
  entity!: WhereParentIdInput;

  @Field(() => [WhereUniqueInput], {
    nullable: true,
  })
  deleteRoles?: WhereUniqueInput[];

  @Field(() => [WhereUniqueInput], {
    nullable: true,
  })
  addRoles?: WhereUniqueInput[];
}
