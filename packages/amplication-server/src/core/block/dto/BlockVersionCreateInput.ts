import { Field, InputType } from '@nestjs/graphql';
import { WhereParentIdInput } from 'src/dto';

@InputType({
  isAbstract: true
})
export class BlockVersionCreateInput {
  @Field(() => WhereParentIdInput, {
    nullable: false
  })
  commit!: WhereParentIdInput;

  @Field(() => WhereParentIdInput, {
    nullable: false
  })
  block!: WhereParentIdInput;
}
