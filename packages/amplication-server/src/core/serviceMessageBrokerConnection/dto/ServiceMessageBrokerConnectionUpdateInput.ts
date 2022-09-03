import { Field, InputType } from '@nestjs/graphql';
import { BlockUpdateInput } from '../../block/dto/BlockUpdateInput';

@InputType({
  isAbstract: true
})
export class ServiceMessageBrokerConnectionUpdateInput extends BlockUpdateInput {
  @Field(() => String, {
    nullable: false
  })
  messageBrokerId!: string;

  @Field(() => Boolean, {
    nullable: false
  })
  enabled!: boolean;
}
