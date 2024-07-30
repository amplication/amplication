import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class RedeemCouponInput {
  @Field(() => String, {
    nullable: false,
  })
  code: string;
}
