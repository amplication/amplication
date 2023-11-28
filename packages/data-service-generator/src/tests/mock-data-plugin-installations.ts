import { PluginInstallation } from "@amplication/code-gen-types";

export const plugins: Record<string, PluginInstallation> = Object.freeze({
  kafka: {
    id: "clb3p3t7z0098jn015na6ork3",
    npm: "@amplication/plugin-broker-kafka",
    enabled: true,
    version: "latest",
    pluginId: "broker-kafka",
    settings: {},
  },
  authCore: {
    id: "auth-core",
    npm: "@amplication/plugin-auth-core",
    enabled: true,
    version: "latest",
    pluginId: "auth-core",
  },
  authJwt: {
    id: "clb3p3uxx009bjn01zfbim7p1",
    npm: "@amplication/plugin-auth-jwt",
    enabled: true,
    version: "latest",
    pluginId: "auth-jwt",
    settings: {},
  },
  grpc: {
    id: "transport-grpc",
    npm: "@amplication/plugin-transport-grpc",
    enabled: true,
    version: "latest",
    pluginId: "transport-grpc",
    configurations: {
      generateGRPC: "true",
    },
  },
  postgres: {
    id: "clb3p3ov800cplc01a8f6uwje",
    npm: "@amplication/plugin-db-postgres",
    enabled: true,
    version: "latest",
    pluginId: "db-postgres",
    settings: {
      host: "localhost",
      port: 5432,
      user: "admin",
      password: "admin",
      dbName: "my-db",
      enableLogging: true,
    },
  },
});
