import { ArgsType, Field } from '@nestjs/graphql';
import { EntityUpdatePermissionFieldRolesInput } from './EntityUpdatePermissionFieldRolesInput';

@ArgsType()
export class UpdateEntityPermissionFieldRolesArgs {
  @Field(() => EntityUpdatePermissionFieldRolesInput, { nullable: false })
  data!: EntityUpdatePermissionFieldRolesInput;
}
