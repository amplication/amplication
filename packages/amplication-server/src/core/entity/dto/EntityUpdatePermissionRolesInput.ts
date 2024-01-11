import { WhereParentIdInput, WhereUniqueInput } from "../../../dto";
import { EnumEntityAction } from "../../../enums/EnumEntityAction";
import { Field, InputType } from "@nestjs/graphql";

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
