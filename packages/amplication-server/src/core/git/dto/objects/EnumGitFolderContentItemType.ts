import { registerEnumType } from "@nestjs/graphql";

export enum EnumGitFolderContentItemType {
  Dir = "Dir",
  File = "File",
  Other = "Other",
}

registerEnumType(EnumGitFolderContentItemType, {
  name: "EnumGitFolderContentItemType",
});
