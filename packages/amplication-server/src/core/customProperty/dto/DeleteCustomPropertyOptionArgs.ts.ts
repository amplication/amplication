import { ArgsType, Field } from "@nestjs/graphql";
import { WhereCustomPropertyOptionUniqueInput } from "./WhereCustomPropertyOptionUniqueInput";

@ArgsType()
export class DeleteCustomPropertyOptionArgs {
  @Field(() => WhereCustomPropertyOptionUniqueInput, { nullable: false })
  where!: WhereCustomPropertyOptionUniqueInput;
}
