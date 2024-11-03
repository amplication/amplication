import { ArgsType, Field } from "@nestjs/graphql";
import { CustomPropertyOptionUpdateInput } from "./CustomPropertyOptionUpdateInput";
import { WhereCustomPropertyOptionUniqueInput } from "./WhereCustomPropertyOptionUniqueInput";

@ArgsType()
export class UpdateCustomPropertyOptionArgs {
  @Field(() => WhereCustomPropertyOptionUniqueInput, { nullable: false })
  where!: WhereCustomPropertyOptionUniqueInput;

  @Field(() => CustomPropertyOptionUpdateInput, { nullable: false })
  data: CustomPropertyOptionUpdateInput;
}
