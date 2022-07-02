import { ArgsType, Field } from '@nestjs/graphql';
import { ProjectUpdateInput } from './project-update.input';
import { ProjectWhereInput } from './project-where-input.input';

@ArgsType()
export class UpdateProjectArgs {
  @Field(() => ProjectUpdateInput, { nullable: false })
  data!: ProjectUpdateInput;

  @Field(() => ProjectWhereInput, { nullable: false })
  where!: ProjectWhereInput;
}
