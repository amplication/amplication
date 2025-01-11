import { ObjectType, Field } from "@nestjs/graphql";
import { GitFolderContentItem } from "./GitFolderContentItem";

@ObjectType({
  isAbstract: true,
})
export class GitFolderContent {
  @Field(() => [GitFolderContentItem], { nullable: false })
  content: GitFolderContentItem[];
}
