import { ArgsType, Field } from "@nestjs/graphql";
import { AiRecommendationsInput } from "./ai-recommendation-input.dto";

@ArgsType()
export class AiRecommendationsArgs {
  @Field(() => AiRecommendationsInput, { nullable: false })
  data!: AiRecommendationsInput;
}
