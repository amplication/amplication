import { WhereParentIdInput } from "../../../dto";
import { InputType, Field } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class BuildCreateInput {
  // Do not expose, injected by the context
  createdBy: WhereParentIdInput;

  @Field(() => WhereParentIdInput)
  resource!: WhereParentIdInput;

  @Field(() => String)
  message: string;

  @Field(() => WhereParentIdInput)
  commit: WhereParentIdInput;
}
