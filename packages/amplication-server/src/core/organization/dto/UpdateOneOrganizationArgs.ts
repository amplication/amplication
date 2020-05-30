import { ArgsType, Field } from '@nestjs/graphql';
import { OrganizationUpdateInput } from './';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class UpdateOneOrganizationArgs {
  @Field(_type => OrganizationUpdateInput, { nullable: false })
  data!: OrganizationUpdateInput;

  @Field(_type => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
