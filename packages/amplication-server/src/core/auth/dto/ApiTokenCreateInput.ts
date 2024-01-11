import { WhereParentIdInput } from "../../../dto";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class ApiTokenCreateInput {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  /**do not expose to GraphQL - This field should be injected from context  */
  user!: WhereParentIdInput;
}
