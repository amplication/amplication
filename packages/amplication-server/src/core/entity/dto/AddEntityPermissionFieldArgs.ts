import { ArgsType, Field } from '@nestjs/graphql';
import { EntityAddPermissionFieldInput } from './EntityAddPermissionFieldInput';

@ArgsType()
export class AddEntityPermissionFieldArgs {
  @Field(() => EntityAddPermissionFieldInput, { nullable: false })
  data!: EntityAddPermissionFieldInput;
}
