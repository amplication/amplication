import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class AiRecommendationsInput {
  @Field(() => String, {
    nullable: false,
  })
  resourceId!: string;
}
