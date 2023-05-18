import { Field, InputType } from "@nestjs/graphql";
import { EnumSubscriptionStatus } from "./EnumSubscriptionStatus";

@InputType({
  isAbstract: true,
})
export class EnumSubscriptionStatusFilter {
  @Field(() => EnumSubscriptionStatus, {
    nullable: true,
  })
  equals?: keyof typeof EnumSubscriptionStatus | null;

  @Field(() => EnumSubscriptionStatus, {
    nullable: true,
  })
  not?: keyof typeof EnumSubscriptionStatus | null;

  @Field(() => [EnumSubscriptionStatus], {
    nullable: true,
  })
  in?: Array<keyof typeof EnumSubscriptionStatus | null>;

  @Field(() => [EnumSubscriptionStatus], {
    nullable: true,
  })
  notIn?: Array<keyof typeof EnumSubscriptionStatus | null>;
}
