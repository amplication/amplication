import { ArgsType, Field } from '@nestjs/graphql';
import { UserRoleInput } from './UserRoleInput';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class UserRoleArgs {
  @Field(() => UserRoleInput, { nullable: false })
  data!: UserRoleInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
