import { WhereParentIdInput } from "../../../dto";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class EntityVersionCreateInput {
  @Field(() => WhereParentIdInput, {
    nullable: false,
  })
  commit!: WhereParentIdInput;

  @Field(() => WhereParentIdInput, {
    nullable: false,
  })
  entity!: WhereParentIdInput;
}
