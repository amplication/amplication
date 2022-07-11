import { ArgsType, Field } from '@nestjs/graphql';
import { ProjectCreateInput } from './ProjectCreateInput';

@ArgsType()
export class ProjectCreateArgs {
  @Field(() => ProjectCreateInput, { nullable: false })
  data!: ProjectCreateInput;
}
