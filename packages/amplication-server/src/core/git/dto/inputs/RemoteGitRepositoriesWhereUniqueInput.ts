import { Field, InputType } from "@nestjs/graphql";
import { EnumGitProvider } from "../enums/EnumGitProvider";

@InputType()
export class RemoteGitRepositoriesWhereUniqueInput {
  @Field(() => String, { nullable: false })
  gitOrganizationId!: string;

  @Field(() => EnumGitProvider, { nullable: false })
  gitProvider!: EnumGitProvider;

  @Field(() => Number, { nullable: false })
  limit!: number;

  @Field(() => Number, { nullable: false })
  page!: number;
}
