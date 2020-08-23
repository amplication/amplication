import { ArgsType, Field } from '@nestjs/graphql';
import { EntityUpdatePermissionInput } from './EntityUpdatePermissionInput';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class UpdateEntityPermissionArgs {
  @Field(() => EntityUpdatePermissionInput, { nullable: false })
  data!: EntityUpdatePermissionInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
