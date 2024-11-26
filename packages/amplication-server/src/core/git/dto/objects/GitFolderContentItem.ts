import { ObjectType, Field } from "@nestjs/graphql";
import { EnumGitFolderContentItemType } from "./EnumGitFolderContentItemType";

@ObjectType({
  isAbstract: true,
})
export class GitFolderContentItem {
  @Field(() => String, { nullable: false })
  name: string | null;

  @Field(() => String, { nullable: false })
  path: string;

  @Field(() => EnumGitFolderContentItemType, { nullable: false })
  type: keyof typeof EnumGitFolderContentItemType;
}
