import { ArgsType, Field } from '@nestjs/graphql';
import { EntityUpdatePermissionRolesInput } from './EntityUpdatePermissionRolesInput';

@ArgsType()
export class UpdateEntityPermissionRolesArgs {
  @Field(() => EntityUpdatePermissionRolesInput, { nullable: false })
  data!: EntityUpdatePermissionRolesInput;
}
