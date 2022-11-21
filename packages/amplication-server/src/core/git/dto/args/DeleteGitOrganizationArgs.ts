import { ArgsType, Field } from "@nestjs/graphql";
import { EnumGitProvider } from "../enums/EnumGitProvider";

@ArgsType()
export class DeleteGitOrganizationArgs {
  @Field(() => String, { nullable: false })
  gitOrganizationId!: string;

  @Field(() => EnumGitProvider, { nullable: false })
  gitProvider!: EnumGitProvider;
}
