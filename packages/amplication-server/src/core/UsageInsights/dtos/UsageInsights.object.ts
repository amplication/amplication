import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
class Metrics {
  @Field(() => Int)
  year: number;

  @Field(() => Int)
  month: number;

  @Field(() => Int)
  timeGroup: number;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class UsageInsights {
  @Field(() => [Metrics])
  results: Metrics[];
}

@ObjectType()
export class UsageInsightsResult {
  @Field(() => UsageInsights)
  builds: UsageInsights;

  @Field(() => UsageInsights)
  entities: UsageInsights;

  @Field(() => UsageInsights)
  plugins: UsageInsights;

  @Field(() => UsageInsights)
  moduleActions: UsageInsights;
}

@ObjectType()
export class EvaluationInsights {
  @Field(() => Int)
  loc: number;

  @Field(() => Int)
  timeSaved: number;

  @Field(() => Int)
  costSaved: number;

  @Field(() => Int)
  codeQuality: number;
}
