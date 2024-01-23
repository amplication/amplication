import { Field, ObjectType } from "@nestjs/graphql";
import { EnumUserActionStatus } from "../../userAction/types";

@ObjectType({
  isAbstract: true,
})
class BreakTheMonolithDataModel {
  @Field()
  originalEntityId: string;

  @Field()
  name: string;
}

@ObjectType({
  isAbstract: true,
})
class Microservice {
  @Field()
  name: string;

  @Field()
  functionality: string;

  @Field(() => [BreakTheMonolithDataModel])
  dataModels: BreakTheMonolithDataModel[];
}

@ObjectType({
  isAbstract: true,
})
export class BreakTheMonolithRecommendationsResult {
  @Field(() => [Microservice])
  microservices: Microservice[];
}

@ObjectType({
  isAbstract: true,
})
export class BreakServiceToMicroserviceResult {
  @Field(() => EnumUserActionStatus, {
    nullable: false,
    description: "The status of the user action",
  })
  status: EnumUserActionStatus;

  @Field(() => String, {
    nullable: false,
    description: "The original resource ID",
  })
  originalResourceId: string;

  @Field(() => BreakTheMonolithRecommendationsResult, {
    nullable: true,
    description: "Prompt result with some data manipulation",
  })
  data: BreakTheMonolithRecommendationsResult;
}
