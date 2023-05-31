import { registerEnumType } from "@nestjs/graphql";
import { EnumGitProvider } from "@amplication/git-utils";

registerEnumType(EnumGitProvider, {
  name: "EnumGitProvider",
});

export { EnumGitProvider };
