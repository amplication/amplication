import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
class TimeGroupCount {
  @Field(() => String)
  timeGroup: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class MetricsGroupedByYear {
  @Field(() => String)
  year: string;

  @Field(() => [TimeGroupCount])
  metrics: TimeGroupCount[];
}

@ObjectType()
export class AnalyticsResults {
  @Field(() => [MetricsGroupedByYear])
  results: MetricsGroupedByYear[];
}

@ObjectType()
export class AllAnalyticsResults {
  @Field(() => AnalyticsResults)
  builds: AnalyticsResults;

  @Field(() => AnalyticsResults)
  entities: AnalyticsResults;

  @Field(() => AnalyticsResults)
  plugins: AnalyticsResults;

  @Field(() => AnalyticsResults)
  moduleActions: AnalyticsResults;

  @Field(() => Number)
  timeSaved: number;

  @Field(() => Number)
  coastSaved: number;

  @Field(() => Number)
  codeQuality: number;
}
