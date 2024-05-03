import { ArgsType, Field } from "@nestjs/graphql";
import { FindSubscriptionsInput } from "./FindSubscriptionsInput";

@ArgsType()
export class FindSubscriptionsArgs {
  @Field(() => FindSubscriptionsInput, { nullable: false })
  where!: FindSubscriptionsInput;
}
