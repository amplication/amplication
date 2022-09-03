import { ArgsType, Field } from '@nestjs/graphql';
import { ServiceMessageBrokerConnectionCreateInput } from './ServiceMessageBrokerConnectionCreateInput';

@ArgsType()
export class CreateServiceMessageBrokerConnectionArgs {
  @Field(() => ServiceMessageBrokerConnectionCreateInput, { nullable: false })
  data!: ServiceMessageBrokerConnectionCreateInput;
}
