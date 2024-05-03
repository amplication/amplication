import { ArgsType, Field } from "@nestjs/graphql";
import { RedeemCouponInput } from "./RedeemCouponInput";

@ArgsType()
export class RedeemCouponArgs {
  @Field(() => RedeemCouponInput, { nullable: false })
  data!: RedeemCouponInput;
}
