import { Field, ObjectType } from "@nestjs/graphql";
import type { ProvisionSubscriptionStatus } from "@stigg/node-server-sdk";

@ObjectType({
  isAbstract: true,
})
export class ProvisionSubscriptionResult {
  @Field(() => String, {
    nullable: false,
  })
  provisionStatus!: ProvisionSubscriptionStatus;

  @Field(() => String, {
    nullable: true,
  })
  checkoutUrl?: string;
}
