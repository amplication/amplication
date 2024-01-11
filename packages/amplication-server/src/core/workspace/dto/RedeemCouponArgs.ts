import { RedeemCouponInput } from "./RedeemCouponInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class RedeemCouponArgs {
  @Field(() => RedeemCouponInput, { nullable: false })
  data!: RedeemCouponInput;
}
