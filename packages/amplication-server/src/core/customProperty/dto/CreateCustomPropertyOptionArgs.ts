import { ArgsType, Field } from "@nestjs/graphql";
import { CustomPropertyOptionCreateInput } from "./CustomPropertyOptionCreateInput";

@ArgsType()
export class CreateCustomPropertyOptionArgs {
  @Field(() => CustomPropertyOptionCreateInput, { nullable: false })
  data!: CustomPropertyOptionCreateInput;
}
