import { ArgsType, Field, Int } from '@nestjs/graphql';
import { ServiceMessageBrokerConnectionOrderByInput } from './ServiceMessageBrokerConnectionOrderByInput';
import { ServiceMessageBrokerConnectionWhereInput } from './ServiceMessageBrokerConnectionWhereInput';

@ArgsType()
export class FindManyServiceMessageBrokerConnectionArgs {
  @Field(() => ServiceMessageBrokerConnectionWhereInput, { nullable: true })
  where?: ServiceMessageBrokerConnectionWhereInput | null;

  @Field(() => ServiceMessageBrokerConnectionOrderByInput, { nullable: true })
  orderBy?: ServiceMessageBrokerConnectionOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
