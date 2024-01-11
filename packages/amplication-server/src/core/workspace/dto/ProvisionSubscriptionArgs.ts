import { ProvisionSubscriptionInput } from "./ProvisionSubscriptionInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class ProvisionSubscriptionArgs {
  @Field(() => ProvisionSubscriptionInput, { nullable: false })
  data!: ProvisionSubscriptionInput;
}
