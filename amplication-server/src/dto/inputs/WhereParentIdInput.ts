import { Field, InputType } from '@nestjs/graphql';
import { WhereUniqueInput } from '../inputs/WhereUniqueInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class WhereParentIdInput {
  @Field(_type => WhereUniqueInput, {
    nullable: false,
    description: undefined
  })
  connect: WhereUniqueInput;
}
