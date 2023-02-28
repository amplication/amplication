import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class ProviderProperties {
  @Field(() => String, { nullable: true })
  installationId: string;
  @Field(() => String, { nullable: true })
  username: string;
  @Field(() => String, { nullable: true })
  uuid: string;
  @Field(() => String, { nullable: true })
  accessToken: string;
  @Field(() => String, { nullable: true })
  refreshToken: string;
  @Field(() => Number, { nullable: true })
  expiresIn: number;
  @Field(() => String, { nullable: true })
  tokenType: string;
  @Field(() => [String], { nullable: true })
  scopes: string[];
  @Field(() => [GitWorkspace], { nullable: true })
  workspaces: GitWorkspace[];
}

@ObjectType({
  isAbstract: true,
})
class GitWorkspace {
  @Field(() => String, { nullable: true })
  name: string;
  @Field(() => String, { nullable: true })
  slug: string;
  @Field(() => String, { nullable: true })
  type: string;
  @Field(() => String, { nullable: true })
  uuid: string;
}
