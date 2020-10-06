import { Field, InputType } from '@nestjs/graphql';
import { WhereParentIdInput } from 'src/dto';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityFieldCreateByDisplayNameInput {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  displayName!: string;

  @Field(() => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  entity!: WhereParentIdInput;
}
