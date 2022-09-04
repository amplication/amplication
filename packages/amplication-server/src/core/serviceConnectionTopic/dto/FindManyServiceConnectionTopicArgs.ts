import { ArgsType, Field, Int } from '@nestjs/graphql';
import { ServiceConnectionTopicOrderByInput } from './ServiceConnectionTopicOrderByInput';
import { ServiceConnectionTopicWhereInput } from './ServiceConnectionTopicWhereInput';

@ArgsType()
export class FindManyServiceConnectionTopicArgs {
  @Field(() => ServiceConnectionTopicWhereInput, { nullable: true })
  where?: ServiceConnectionTopicWhereInput | null;

  @Field(() => ServiceConnectionTopicOrderByInput, { nullable: true })
  orderBy?: ServiceConnectionTopicOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
