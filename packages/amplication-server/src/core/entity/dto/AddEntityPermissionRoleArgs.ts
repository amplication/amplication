import { ArgsType, Field } from '@nestjs/graphql';
import { EntityAddPermissionRoleInput } from './EntityAddPermissionRoleInput';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class AddEntityPermissionRoleArgs {
  @Field(() => EntityAddPermissionRoleInput, { nullable: false })
  data!: EntityAddPermissionRoleInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
