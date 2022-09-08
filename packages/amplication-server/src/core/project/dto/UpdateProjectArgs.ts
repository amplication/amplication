import { ArgsType, Field } from '@nestjs/graphql';
import { WhereUniqueInput } from 'src/dto';
import { ProjectUpdateInput } from './ProjectUpdateInput';

@ArgsType()
export class UpdateProjectArgs {
  @Field(() => ProjectUpdateInput, { nullable: false })
  data!: ProjectUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
