import { Field, ObjectType } from "@nestjs/graphql";
import { BtmEntityRecommendation } from "./btm-entity-recommendation.dto";

@ObjectType({
  isAbstract: true,
})
export class BtmResourceRecommendation {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => String, {
    nullable: false,
    description: "The name of the resource (microservice)",
  })
  name!: string;

  @Field(() => String, {
    nullable: true,
    description: "The description of the resource (microservice)",
  })
  description?: string | null;

  @Field(() => [BtmEntityRecommendation], {
    nullable: false,
    description: "The entities of the resource (microservice)",
  })
  entities!: BtmEntityRecommendation[];
}
