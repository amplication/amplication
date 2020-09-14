import { Field, ArgsType, Int } from '@nestjs/graphql';
import { BuildLogOrderByInput } from './BuildLogOrderByInput';
import { BuildLogWhereInput } from './BuildLogWhereInput';

@ArgsType()
export class FindManyBuildLogArgs {
  @Field(() => BuildLogWhereInput, { nullable: true })
  where?: BuildLogWhereInput | null;

  @Field(() => [BuildLogOrderByInput], { nullable: true })
  orderBy?: BuildLogOrderByInput[] | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;
}
