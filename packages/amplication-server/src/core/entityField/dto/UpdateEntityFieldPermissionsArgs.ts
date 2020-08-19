import { ArgsType, Field } from '@nestjs/graphql';
import { EntityFieldUpdatePermissionsInput } from './EntityFieldUpdatePermissionsInput';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class UpdateEntityFieldPermissionsArgs {
  @Field(() => EntityFieldUpdatePermissionsInput, { nullable: false })
  data!: EntityFieldUpdatePermissionsInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
