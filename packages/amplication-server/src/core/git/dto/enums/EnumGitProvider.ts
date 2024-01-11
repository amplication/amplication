import { EnumGitProvider } from "@amplication/util/git";
import { registerEnumType } from "@nestjs/graphql";

registerEnumType(EnumGitProvider, {
  name: "EnumGitProvider",
});

export { EnumGitProvider };
