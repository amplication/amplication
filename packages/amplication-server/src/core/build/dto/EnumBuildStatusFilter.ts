import { Field, InputType } from "@nestjs/graphql";
import { EnumBuildStatus } from "./EnumBuildStatus";

@InputType({
  isAbstract: true,
})
export class EnumBuildStatusFilter {
  @Field(() => EnumBuildStatus, {
    nullable: true,
  })
  equals?: (typeof EnumBuildStatus)[keyof typeof EnumBuildStatus] | null;

  @Field(() => EnumBuildStatus, {
    nullable: true,
  })
  not?: (typeof EnumBuildStatus)[keyof typeof EnumBuildStatus] | null;

  @Field(() => [EnumBuildStatus], {
    nullable: true,
  })
  in?: (typeof EnumBuildStatus)[keyof typeof EnumBuildStatus][] | null;

  @Field(() => [EnumBuildStatus], {
    nullable: true,
  })
  notIn?: (typeof EnumBuildStatus)[keyof typeof EnumBuildStatus][] | null;
}
