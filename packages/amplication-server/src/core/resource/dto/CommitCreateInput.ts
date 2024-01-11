import { WhereParentIdInput } from "../../../dto";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class CommitCreateInput {
  @Field(() => String, {
    nullable: false,
  })
  message!: string;

  @Field(() => WhereParentIdInput, {
    nullable: false,
  })
  project!: WhereParentIdInput;

  @Field(() => Boolean, {
    nullable: true,
    defaultValue: false,
    description:
      "It will bypass the limitations of the plan (if any). It will only work for limitation that support commit bypass.",
  })
  bypassLimitations? = false;

  /**do not expose to GraphQL - This field should be injected from context  */
  user!: WhereParentIdInput;
}
