import { Field, InputType } from '@nestjs/graphql';
import { WhereParentIdInput } from 'src/dto';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityVersionCreateInput {
  @Field(() => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  commit!: WhereParentIdInput;

  @Field(() => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  entity!: WhereParentIdInput;
}
