import { Field, InputType, Int } from '@nestjs/graphql';
import { WhereParentIdInput } from '../../../dto/inputs';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityVersionCreateInput {
  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  label!: string;

  @Field(_type => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  //entity!: Entity;
  entity!: WhereParentIdInput;
}
