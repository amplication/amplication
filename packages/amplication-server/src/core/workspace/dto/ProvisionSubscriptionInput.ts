import { Field, InputType } from "@nestjs/graphql";
import { BillingPeriod } from "@stigg/node-server-sdk";

@InputType({
  isAbstract: true,
})
export class ProvisionSubscriptionInput {
  @Field(() => String, {
    nullable: false,
  })
  workspaceId: string;

  @Field(() => String, {
    nullable: false,
  })
  planId: string;

  @Field(() => String, {
    nullable: false,
  })
  billingPeriod: BillingPeriod;

  @Field(() => String, {
    nullable: false,
  })
  intentionType: "UPGRADE_PLAN" | "DOWNGRADE_PLAN";

  @Field(() => String, {
    nullable: true,
  })
  successUrl?: string;

  @Field(() => String, {
    nullable: true,
  })
  cancelUrl?: string;
}
