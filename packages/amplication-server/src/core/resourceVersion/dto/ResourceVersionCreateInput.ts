import { InputType, Field } from "@nestjs/graphql";
import { WhereParentIdInput } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class ResourceVersionCreateInput {
  // Do not expose, injected by the context
  createdBy: WhereParentIdInput;

  @Field(() => WhereParentIdInput)
  resource!: WhereParentIdInput;

  @Field(() => String)
  message: string;

  @Field(() => WhereParentIdInput)
  commit: WhereParentIdInput;

  @Field(() => String)
  version: string;
}
