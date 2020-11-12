import { ArgsType, Field } from '@nestjs/graphql';
import { WhereUniqueInput } from 'src/dto/WhereUniqueInput';

@ArgsType()
export class SetCurrentOrganizationArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  data!: WhereUniqueInput;
}
