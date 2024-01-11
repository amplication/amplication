import { FindSubscriptionsInput } from "./FindSubscriptionsInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class FindSubscriptionsArgs {
  @Field(() => FindSubscriptionsInput, { nullable: false })
  where!: FindSubscriptionsInput;
}
