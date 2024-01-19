import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class BtmRecommendationModelChangesInput {
  @Field(() => String, {
    nullable: false,
  })
  resourceId!: string;
}
