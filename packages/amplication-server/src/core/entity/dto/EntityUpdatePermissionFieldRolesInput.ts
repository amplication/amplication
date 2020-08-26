import { Field, InputType } from '@nestjs/graphql';
import { WhereParentIdInput, WhereUniqueInput } from 'src/dto';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityUpdatePermissionFieldRolesInput {
  @Field(() => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  permissionField!: WhereParentIdInput;

  @Field(() => [WhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  deletePermissionRoles?: WhereUniqueInput[];

  @Field(() => [WhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  addPermissionRoles?: WhereUniqueInput[];
}
