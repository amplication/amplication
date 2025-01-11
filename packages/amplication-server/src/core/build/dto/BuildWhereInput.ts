import { InputType, Field } from "@nestjs/graphql";
import { WhereUniqueInput, DateTimeFilter, StringFilter } from "../../../dto";
import { EnumBuildGitStatusFilter } from "./EnumBuildGitStatusFilter";
import { EnumBuildStatusFilter } from "./EnumBuildStatusFilter";

@InputType({
  isAbstract: true,
})
export class BuildWhereInput {
  @Field(() => StringFilter, {
    nullable: true,
  })
  id?: StringFilter | null | undefined;

  @Field(() => DateTimeFilter, {
    nullable: true,
  })
  createdAt?: DateTimeFilter | null | undefined;

  @Field(() => WhereUniqueInput, {
    nullable: true,
  })
  resource?: WhereUniqueInput;

  @Field(() => WhereUniqueInput, {
    nullable: true,
  })
  createdBy?: WhereUniqueInput | null | undefined;

  @Field(() => StringFilter, {
    nullable: true,
  })
  version?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  message?: StringFilter | null;

  @Field(() => WhereUniqueInput, {
    nullable: true,
  })
  commit?: WhereUniqueInput;

  @Field(() => EnumBuildStatusFilter, {
    nullable: true,
  })
  status?: EnumBuildStatusFilter | null;

  @Field(() => EnumBuildGitStatusFilter, {
    nullable: true,
  })
  gitStatus?: EnumBuildGitStatusFilter | null;
}
