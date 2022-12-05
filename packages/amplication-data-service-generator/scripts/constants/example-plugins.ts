import { PluginInstallation } from "@amplication/code-gen-types";

export const plugins: Record<string, PluginInstallation> = {
  kafka: {
    id: "clb3p3t7z0098jn015na6ork3",
    npm: "@amplication/plugin-broker-kafka",
    enabled: true,
    version: "latest",
    pluginId: "broker-kafka",
    settings: {},
  },
  jwtAuth: {
    id: "clb3p3uxx009bjn01zfbim7p1",
    npm: "@amplication/plugin-auth-jwt",
    enabled: true,
    version: "latest",
    pluginId: "auth-jwt",
    settings: {},
  },
  postgresPlugin: {
    id: "clb3p3ov800cplc01a8f6uwje",
    npm: "@amplication/plugin-db-postgres",
    enabled: true,
    version: "0.0.1",
    pluginId: "db-postgres",
    settings: {
      defaultPort: "5432",
      enableLogging: true,
    },
  },
};
