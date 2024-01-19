import { ArgsType, Field } from "@nestjs/graphql";
import { BtmRecommendationModelChangesInput } from "./btm-recommendation-model-changes-input.dto";

@ArgsType()
export class BtmRecommendationModelChangesArgs {
  @Field(() => BtmRecommendationModelChangesInput, { nullable: false })
  data!: BtmRecommendationModelChangesInput;
}
