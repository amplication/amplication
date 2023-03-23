import { ObjectType, Field } from "@nestjs/graphql";
import { OAuth2User } from "./OAuth2User";

@ObjectType({
  isAbstract: true,
})
export class GitOAuth2Flow {
  @Field(() => String, { nullable: false })
  accessToken!: string;

  @Field(() => String, { nullable: false })
  refreshToken!: string;

  @Field(() => String, { nullable: false })
  tokenType!: string;

  @Field(() => Number, { nullable: false })
  expiresIn!: number;

  @Field(() => [String], { nullable: false })
  scopes: string[];

  @Field(() => OAuth2User, { nullable: false })
  userData: OAuth2User;
}
