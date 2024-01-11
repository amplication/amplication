import { EnumGitProvider } from "../enums/EnumGitProvider";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class DeleteGitOrganizationArgs {
  @Field(() => String, { nullable: false })
  gitOrganizationId!: string;

  @Field(() => EnumGitProvider, { nullable: false })
  gitProvider!: EnumGitProvider;
}
