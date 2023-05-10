import { Field, InputType } from "@nestjs/graphql";
import { EnumGitProvider } from "../enums/EnumGitProvider";
import { Min, Max, IsInt } from "class-validator";

@InputType()
export class RemoteGitRepositoriesWhereUniqueInput {
  @Field(() => String, { nullable: false })
  gitOrganizationId!: string;

  @Field(() => EnumGitProvider, { nullable: false })
  gitProvider!: EnumGitProvider;

  @Field(() => Number, {
    nullable: false,
    defaultValue: 10,
    description: "The number of items to return per page",
  })
  @IsInt()
  @Min(10)
  @Max(100)
  perPage!: number;

  @Field(() => Number, {
    nullable: false,
    defaultValue: 1,
    description: "The page number. One-based indexing",
  })
  @IsInt()
  @Min(1)
  page!: number;

  @Field(() => String, { nullable: true })
  groupName?: string;
}
