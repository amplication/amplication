import { Field, InputType } from '@nestjs/graphql';
import { EnumEntityAction } from 'src/enums/EnumEntityAction';
import { WhereParentIdInput, WhereUniqueInput } from 'src/dto';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityUpdatePermissionRolesInput {
  @Field(() => EnumEntityAction, { nullable: false })
  action!: EnumEntityAction;

  @Field(() => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  entity!: WhereParentIdInput;

  @Field(() => [WhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  deleteRoles?: WhereUniqueInput[];

  @Field(() => [WhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  addRoles?: WhereUniqueInput[];
}
