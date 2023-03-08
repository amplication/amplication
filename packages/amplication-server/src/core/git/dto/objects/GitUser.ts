import { ObjectType, Field } from "@nestjs/graphql";
import { GitUserLinks } from "./GitUserLinks";

@ObjectType({
  isAbstract: true,
})
export class GitUser {
  @Field(() => String, { nullable: false })
  username!: string;
}

@ObjectType({
  isAbstract: true,
})
export class OAuth2User extends GitUser {
  @Field(() => String, { nullable: false })
  username!: string;

  @Field(() => String, { nullable: false })
  displayName!: string;

  @Field(() => String, { nullable: false })
  uuid!: string;

  @Field(() => GitUserLinks, { nullable: false })
  links!: GitUserLinks;

  @Field(() => String, { nullable: true })
  createdOn: string;
}
