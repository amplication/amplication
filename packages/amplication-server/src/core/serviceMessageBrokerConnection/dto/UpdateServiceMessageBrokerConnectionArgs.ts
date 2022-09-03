import { ArgsType, Field } from '@nestjs/graphql';
import { UpdateBlockArgs } from '../../block/dto/UpdateBlockArgs';
import { ServiceMessageBrokerConnectionUpdateInput } from './ServiceMessageBrokerConnectionUpdateInput';

@ArgsType()
export class UpdateServiceMessageBrokerConnectionArgs extends UpdateBlockArgs {
  @Field(() => ServiceMessageBrokerConnectionUpdateInput, { nullable: false })
  data!: ServiceMessageBrokerConnectionUpdateInput;
}
