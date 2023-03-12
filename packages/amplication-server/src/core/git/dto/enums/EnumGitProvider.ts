import { registerEnumType } from "@nestjs/graphql";

export enum EnumGitProvider {
  Github = "Github",
  Bitbucket = "Bitbucket",
}

registerEnumType(EnumGitProvider, {
  name: "EnumGitProvider",
});
