import { EnumSubscriptionPlan } from "../../subscription/dto";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class Coupon {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  createdAt!: Date;

  updatedAt!: Date;

  @Field(() => String, {
    nullable: false,
  })
  code!: string;

  @Field(() => EnumSubscriptionPlan, {
    nullable: false,
  })
  subscriptionPlan!: keyof typeof EnumSubscriptionPlan;

  @Field(() => Int, {
    nullable: false,
  })
  durationMonths: number;

  @Field(() => String, {
    nullable: true,
  })
  couponType: string;
}
