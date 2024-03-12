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
