import { Field, ObjectType } from '@nestjs/graphql';
import { IBlock } from 'src/models';

@ObjectType({
  isAbstract: true,
  implements: [IBlock]
})
export class ServiceMessageBrokerConnection extends IBlock {
  @Field(() => String, {
    nullable: false
  })
  messageBrokerId!: string;

  @Field(() => Boolean, {
    nullable: false
  })
  enabled!: boolean;
}
