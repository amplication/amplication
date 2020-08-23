import { ArgsType, Field } from '@nestjs/graphql';
import { EntityPermissionRoleWhereUniqueInput } from './EntityPermissionRoleWhereUniqueInput';

@ArgsType()
export class DeleteEntityPermissionRoleArgs {
  @Field(() => EntityPermissionRoleWhereUniqueInput, { nullable: false })
  where!: EntityPermissionRoleWhereUniqueInput;
}
