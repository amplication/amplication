import { ArgsType, Field } from '@nestjs/graphql';
import { ProjectCreateInput } from '../inputs/ProjectCreateInput';

@ArgsType()
export class CreateOneProjectArgs {
  @Field(_type => ProjectCreateInput, { nullable: false })
  data!: ProjectCreateInput;
}
