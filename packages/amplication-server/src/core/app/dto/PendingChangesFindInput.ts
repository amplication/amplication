import { Field, InputType } from '@nestjs/graphql';
import { WhereUniqueInput } from 'src/dto/';

@InputType({
  isAbstract: true
})
export class PendingChangesFindInput {
  @Field(() => WhereUniqueInput, {
    nullable: false
  })
  app!: WhereUniqueInput;
}
