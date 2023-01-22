import { ArgsType, Field } from "@nestjs/graphql";
import { ProvisionSubscriptionInput } from "./ProvisionSubscriptionInput";

@ArgsType()
export class ProvisionSubscriptionArgs {
  @Field(() => ProvisionSubscriptionInput, { nullable: false })
  data!: ProvisionSubscriptionInput;
}
