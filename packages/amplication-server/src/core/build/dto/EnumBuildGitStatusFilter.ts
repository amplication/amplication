import { Field, InputType } from "@nestjs/graphql";
import { EnumBuildGitStatus } from "./EnumBuildGitStatus";

@InputType({
  isAbstract: true,
})
export class EnumBuildGitStatusFilter {
  @Field(() => EnumBuildGitStatus, {
    nullable: true,
  })
  equals?: (typeof EnumBuildGitStatus)[keyof typeof EnumBuildGitStatus] | null;

  @Field(() => EnumBuildGitStatus, {
    nullable: true,
  })
  not?: (typeof EnumBuildGitStatus)[keyof typeof EnumBuildGitStatus] | null;

  @Field(() => [EnumBuildGitStatus], {
    nullable: true,
  })
  in?: (typeof EnumBuildGitStatus)[keyof typeof EnumBuildGitStatus][] | null;

  @Field(() => [EnumBuildGitStatus], {
    nullable: true,
  })
  notIn?: (typeof EnumBuildGitStatus)[keyof typeof EnumBuildGitStatus][] | null;
}
