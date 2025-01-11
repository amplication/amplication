import { Field, InputType } from "@nestjs/graphql";
import { WhereParentIdInput } from "../../../dto";
import { EnumCommitStrategy } from "./EnumCommitStrategy";
import { EnumResourceTypeGroup } from "./EnumResourceTypeGroup";
import { CommitResourceVersionCreateInput } from "./CommitResourceVersionCreateInput";

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

  @Field(() => EnumResourceTypeGroup, { nullable: false })
  resourceTypeGroup!: keyof typeof EnumResourceTypeGroup;

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
    description: `The resources to commit, when strategy is "Specific". On other strategies, this field will be ignored.`,
  })
  resourceIds?: string[];

  @Field(() => [CommitResourceVersionCreateInput], {
    nullable: true,
  })
  resourceVersions?: CommitResourceVersionCreateInput[];

  /**do not expose to GraphQL - This field should be injected from context  */
  user!: WhereParentIdInput;
}
