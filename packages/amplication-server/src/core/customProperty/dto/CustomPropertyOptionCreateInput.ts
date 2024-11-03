import { Field, InputType } from "@nestjs/graphql";
import { WhereParentIdInput } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class CustomPropertyOptionCreateInput {
  @Field(() => String, {
    nullable: true,
  })
  value!: string;

  @Field(() => WhereParentIdInput, {
    nullable: false,
  })
  customProperty!: WhereParentIdInput;
}
