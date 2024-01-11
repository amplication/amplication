import { WhereParentIdInput } from "../../../dto";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class BlockVersionCreateInput {
  @Field(() => WhereParentIdInput, {
    nullable: false,
  })
  commit!: WhereParentIdInput;

  @Field(() => WhereParentIdInput, {
    nullable: false,
  })
  block!: WhereParentIdInput;
}
