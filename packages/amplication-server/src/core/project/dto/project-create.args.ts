import { ArgsType, Field } from '@nestjs/graphql';
import { ProjectCreateInput } from './project-create.input';

@ArgsType()
export class ProjectCreateArgs {
  @Field(() => ProjectCreateInput, { nullable: false })
  data!: ProjectCreateInput;
}
