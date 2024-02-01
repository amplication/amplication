import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class GitOrganizationCreateInputGitHub {
  @Field(() => String, {
    nullable: false,
  })
  installationId!: string;
}
