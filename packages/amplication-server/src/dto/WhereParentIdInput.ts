import { Field, InputType } from '@nestjs/graphql';
import { WhereUniqueInput } from '../dto/WhereUniqueInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class WhereParentIdInput {
  @Field(() => WhereUniqueInput, {
    nullable: false,
    description: undefined
  })
  connect: WhereUniqueInput;
}
