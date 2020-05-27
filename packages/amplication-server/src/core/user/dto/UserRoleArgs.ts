import { ArgsType, Field } from '@nestjs/graphql';
import { UserRoleInput } from './';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class UserRoleArgs {
  @Field(_type => UserRoleInput, { nullable: false })
  data!: UserRoleInput;

  @Field(_type => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
