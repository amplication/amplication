import { ArgsType, Field, Int } from '@nestjs/graphql';
import { ProjectOrderByInput } from './project-order-by.input';
import { ProjectWhereInput } from './project-where-input.input';

@ArgsType()
export class ProjectFindManyArgs {
  @Field(() => ProjectWhereInput, { nullable: true })
  where?: ProjectWhereInput;

  @Field(() => ProjectOrderByInput, { nullable: true })
  orderBy?: ProjectOrderByInput;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
