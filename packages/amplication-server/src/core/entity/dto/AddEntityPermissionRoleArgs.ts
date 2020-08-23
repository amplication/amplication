import { ArgsType, Field } from '@nestjs/graphql';
import { EntityAddPermissionRoleInput } from './EntityAddPermissionRoleInput';

@ArgsType()
export class AddEntityPermissionRoleArgs {
  @Field(() => EntityAddPermissionRoleInput, { nullable: false })
  data!: EntityAddPermissionRoleInput;
}
