import { Field, InputType } from '@nestjs/graphql';
import { WhereParentIdInput } from 'src/dto';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityVersionCreateInput {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  label!: string;

  @Field(() => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  //entity!: Entity;
  entity!: WhereParentIdInput;
}
