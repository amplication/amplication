import { Field, InputType } from "@nestjs/graphql";
import { EnumOutdatedVersionAlertType } from "./EnumOutdatedVersionAlertType";

@InputType({
  isAbstract: true,
})
export class EnumOutdatedVersionAlertTypeFilter {
  @Field(() => EnumOutdatedVersionAlertType, {
    nullable: true,
  })
  equals?:
    | (typeof EnumOutdatedVersionAlertType)[keyof typeof EnumOutdatedVersionAlertType]
    | null;

  @Field(() => EnumOutdatedVersionAlertType, {
    nullable: true,
  })
  not?:
    | (typeof EnumOutdatedVersionAlertType)[keyof typeof EnumOutdatedVersionAlertType]
    | null;

  @Field(() => [EnumOutdatedVersionAlertType], {
    nullable: true,
  })
  in?:
    | (typeof EnumOutdatedVersionAlertType)[keyof typeof EnumOutdatedVersionAlertType][]
    | null;

  @Field(() => [EnumOutdatedVersionAlertType], {
    nullable: true,
  })
  notIn?:
    | (typeof EnumOutdatedVersionAlertType)[keyof typeof EnumOutdatedVersionAlertType][]
    | null;
}
