import { Field, InputType } from '@nestjs/graphql';
import { JsonValue } from 'type-fest';
import { BlockCreateInput } from '../../block/dto/BlockCreateInput';
import { MessagePatternCreateInput } from './messagePattern/MessagePatternCreateInput';

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

  @Field(() => [MessagePatternCreateInput], { nullable: false })
  patterns!: MessagePatternCreateInput[] & JsonValue;
}
