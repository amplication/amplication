import { registerEnumType } from "@nestjs/graphql";
import { EnumGitProvider } from "@amplication/util/git";

registerEnumType(EnumGitProvider, {
  name: "EnumGitProvider",
});

export { EnumGitProvider };
