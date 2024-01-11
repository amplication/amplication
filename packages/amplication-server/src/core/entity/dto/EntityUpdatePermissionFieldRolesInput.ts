import { WhereParentIdInput, WhereUniqueInput } from "../../../dto";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class EntityUpdatePermissionFieldRolesInput {
  @Field(() => WhereParentIdInput, {
    nullable: false,
  })
  permissionField!: WhereParentIdInput;

  @Field(() => [WhereUniqueInput], {
    nullable: true,
  })
  deletePermissionRoles?: WhereUniqueInput[];

  @Field(() => [WhereUniqueInput], {
    nullable: true,
  })
  addPermissionRoles?: WhereUniqueInput[];
}
