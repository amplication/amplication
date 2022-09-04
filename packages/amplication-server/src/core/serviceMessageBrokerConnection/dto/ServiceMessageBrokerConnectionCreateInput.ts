import { Field, InputType } from '@nestjs/graphql';
import { BlockCreateInput } from '../../block/dto/BlockCreateInput';

@InputType({
  isAbstract: true
})
export class ServiceMessageBrokerConnectionCreateInput extends BlockCreateInput {
  @Field(() => String, {
    nullable: false
  })
  messageBrokerId!: string;

  @Field(() => Boolean, {
    nullable: false
  })
  enabled!: boolean;
}
