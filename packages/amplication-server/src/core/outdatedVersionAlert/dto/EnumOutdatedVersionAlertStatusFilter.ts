import { Field, InputType } from "@nestjs/graphql";
import { EnumOutdatedVersionAlertStatus } from "./EnumOutdatedVersionAlertStatus";

@InputType({
  isAbstract: true,
})
export class EnumOutdatedVersionAlertStatusFilter {
  @Field(() => EnumOutdatedVersionAlertStatus, {
    nullable: true,
  })
  equals?:
    | (typeof EnumOutdatedVersionAlertStatus)[keyof typeof EnumOutdatedVersionAlertStatus]
    | null;

  @Field(() => EnumOutdatedVersionAlertStatus, {
    nullable: true,
  })
  not?:
    | (typeof EnumOutdatedVersionAlertStatus)[keyof typeof EnumOutdatedVersionAlertStatus]
    | null;

  @Field(() => [EnumOutdatedVersionAlertStatus], {
    nullable: true,
  })
  in?:
    | (typeof EnumOutdatedVersionAlertStatus)[keyof typeof EnumOutdatedVersionAlertStatus][]
    | null;

  @Field(() => [EnumOutdatedVersionAlertStatus], {
    nullable: true,
  })
  notIn?:
    | (typeof EnumOutdatedVersionAlertStatus)[keyof typeof EnumOutdatedVersionAlertStatus][]
    | null;
}
