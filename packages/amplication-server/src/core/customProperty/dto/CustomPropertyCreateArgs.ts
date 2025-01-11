import { ArgsType, Field } from "@nestjs/graphql";
import { CustomPropertyCreateInput } from "./CustomPropertyCreateInput";

@ArgsType()
export class CustomPropertyCreateArgs {
  @Field(() => CustomPropertyCreateInput, { nullable: false })
  data!: CustomPropertyCreateInput;
}
