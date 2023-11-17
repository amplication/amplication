import { CodegenConfig } from "@graphql-codegen/cli";
import type { Types } from "@graphql-codegen/plugin-helpers";
import serverProject from "./packages/amplication-server/project.json";

const generates = serverProject.targets[
  "graphql:models:generate"
].outputs.reduce(
  (acc, curr) => {
    if (curr === "packages/amplication-client/src/models.ts") {
      acc[curr] = {
        documents: ["packages/amplication-client/src/**/*.query.ts"],
        plugins: [
          "typescript",
          "typescript-operations",
          "typescript-react-apollo",
        ],
        config: { withHooks: true },
      };
    } else acc[curr] = { plugins: ["typescript"] };
    return acc;
  },
  {} as {
    [outputPath: string]: Types.ConfiguredOutput | Types.ConfiguredPlugin[];
  }
);

const config: CodegenConfig = {
  overwrite: true,
  schema: "packages/amplication-server/src/schema.graphql",
  config: {
    skipTypename: true,
  },
  generates,
};

export default config;
