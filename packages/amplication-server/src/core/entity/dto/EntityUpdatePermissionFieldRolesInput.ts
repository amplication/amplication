import { Field, InputType } from '@nestjs/graphql';
import { WhereParentIdInput, WhereUniqueInput } from 'src/dto';

@InputType({
  isAbstract: true
})
export class EntityUpdatePermissionFieldRolesInput {
  @Field(() => WhereParentIdInput, {
    nullable: false
  })
  permissionField!: WhereParentIdInput;

  @Field(() => [WhereUniqueInput], {
    nullable: true
  })
  deletePermissionRoles?: WhereUniqueInput[];

  @Field(() => [WhereUniqueInput], {
    nullable: true
  })
  addPermissionRoles?: WhereUniqueInput[];
}
