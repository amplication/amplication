import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class GitOrganizationCreateInputAwsCodeCommit {
  @Field(() => String, {
    nullable: false,
    description: "HTTPS Git credentials for AWS CodeCommit. Username",
  })
  gitUsername!: string;

  @Field(() => String, {
    nullable: false,
    description: "HTTPS Git credentials for AWS CodeCommit. Password",
  })
  gitPassword!: string;

  @Field(() => String, {
    nullable: false,
    description: "AWS access key ID",
  })
  accessKeyId!: string;

  @Field(() => String, {
    nullable: false,
    description: "AWS secret access key",
  })
  accessKeySecret!: string;

  @Field(() => String, {
    nullable: true,
    defaultValue: "us-east-1",
    description: "AWS region. Defaults to us-east-1",
  })
  region?: string;
}
