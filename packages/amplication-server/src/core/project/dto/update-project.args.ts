import { ArgsType, Field } from '@nestjs/graphql';
import { ProjectUpdateInput } from './project-update.input';

@ArgsType()
export class UpdateProjectArgs {
  @Field(() => ProjectUpdateInput, { nullable: false })
  data!: ProjectUpdateInput;
}
