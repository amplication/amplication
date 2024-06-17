import { Field, InputType } from "@nestjs/graphql";
import { WhereParentIdInput } from "../../../dto";
import { EnumCommitStrategy } from "./EnumCommitStrategy";

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

  @Field(() => EnumCommitStrategy, {
    nullable: true,
    description:
      "The strategy to use when committing the changes. If not provided, the default strategy will be used.",
    defaultValue: EnumCommitStrategy.All,
  })
  commitStrategy?: EnumCommitStrategy;

  @Field(() => [String], {
    nullable: true,
    description: `The resources to commit. By default, it contains all the project resources. 
      If the commit strategy is AllWithPendingChanges, the server will . 
      If the commit strategy is Specific, it will be an array with one element. 
      For on boarding only the newly created service will be committed.`,
  })
  resourceIds?: string[];

  /**do not expose to GraphQL - This field should be injected from context  */
  user!: WhereParentIdInput;
}
