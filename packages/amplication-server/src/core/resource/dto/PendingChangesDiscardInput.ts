import { Field, InputType } from "@nestjs/graphql";
import { WhereParentIdInput } from "../../../dto";
import { EnumResourceTypeGroup } from "./EnumResourceTypeGroup";

@InputType({
  isAbstract: true,
})
export class PendingChangesDiscardInput {
  @Field(() => WhereParentIdInput, {
    nullable: false,
  })
  project!: WhereParentIdInput;

  @Field(() => EnumResourceTypeGroup, { nullable: false })
  resourceTypeGroup!: keyof typeof EnumResourceTypeGroup;

  /**do not expose to GraphQL - This field should be injected from context  */
  user!: WhereParentIdInput;
}
