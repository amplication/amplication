import { GitUserLinks } from "./GitLinks";
import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class OAuth2User {
  @Field(() => String, { nullable: false })
  username: string;

  @Field(() => String, { nullable: false })
  displayName: string;

  @Field(() => String, { nullable: false })
  uuid: string;

  @Field(() => GitUserLinks, { nullable: false })
  links: GitUserLinks;
}
