import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class ProviderProperties {
  @Field(() => String, { nullable: true })
  installationId?: string;
  @Field(() => String, { nullable: true })
  username?: string;
  @Field(() => String, { nullable: true })
  uuid?: string;
  @Field(() => String, { nullable: true })
  accessToken?: string;
  @Field(() => String, { nullable: true })
  refreshToken?: string;
  @Field(() => Number, { nullable: true })
  expiresIn?: number;
  @Field(() => String, { nullable: true })
  tokenType?: string;
  @Field(() => [String], { nullable: true })
  scopes?: string[];
}
