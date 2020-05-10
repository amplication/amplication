import { ArgsType, Field } from '@nestjs/graphql';
import { ProjectUpdateInput } from '../inputs';
import { WhereUniqueInput } from '../inputs';

@ArgsType()
export class UpdateOneProjectArgs {
  @Field(_type => ProjectUpdateInput, { nullable: false })
  data!: ProjectUpdateInput;

  @Field(_type => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
