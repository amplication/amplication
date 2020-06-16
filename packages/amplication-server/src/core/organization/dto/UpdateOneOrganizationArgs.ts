import { ArgsType, Field } from '@nestjs/graphql';
import { OrganizationUpdateInput } from './OrganizationUpdateInput';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class UpdateOneOrganizationArgs {
  @Field(() => OrganizationUpdateInput, { nullable: false })
  data!: OrganizationUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
