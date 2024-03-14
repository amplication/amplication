import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
class Metrics {
  @Field(() => String)
  timeGroup: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class MetricsGroupedByYear {
  @Field(() => String)
  year: string;

  @Field(() => [Metrics])
  metrics: Metrics[];
}

@ObjectType()
export class UsageInsights {
  @Field(() => [MetricsGroupedByYear])
  results: MetricsGroupedByYear[];
}

@ObjectType()
export class AnalyticsResults {
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
  @Field(() => Number)
  loc: number;

  @Field(() => Number)
  timeSaved: number;

  @Field(() => Number)
  costSaved: number;

  @Field(() => Number)
  codeQuality: number;
}
