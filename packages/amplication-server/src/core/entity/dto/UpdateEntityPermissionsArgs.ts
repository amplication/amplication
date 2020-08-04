import { ArgsType, Field } from '@nestjs/graphql';
import { EntityUpdatePermissionsInput } from './EntityUpdatePermissionsInput';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class UpdateEntityPermissionsArgs {
  @Field(() => EntityUpdatePermissionsInput, { nullable: false })
  data!: EntityUpdatePermissionsInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
