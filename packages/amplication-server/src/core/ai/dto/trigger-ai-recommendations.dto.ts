import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class TriggerAiRecommendations {
  @Field(() => String, {
    nullable: false,
  })
  actionId!: string;
}
