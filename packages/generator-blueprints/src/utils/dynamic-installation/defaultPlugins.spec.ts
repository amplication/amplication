import {
  MSSQL_PLUGIN_ID,
  MSSQL_PLUGIN_NPM,
  POSTGRESQL_PLUGIN_ID,
  prepareDefaultPlugins,
} from "./defaultPlugins";

describe("prepareDefaultPlugins", () => {
  it("should not return default plugins even if no plugins are installed", () => {
    const result = prepareDefaultPlugins([]);

    expect(result).toEqual([]);
  });

  it("should return installed plugins if they are part of the default plugin category", () => {
    const expectedPlugins = [
      {
        id: "placeholder-id",
        pluginId: "plugin-id",
        npm: "plugin-npm",
        enabled: true,
        version: "latest",
      },
      {
        id: "id-123",
        pluginId: MSSQL_PLUGIN_ID,
        npm: MSSQL_PLUGIN_NPM,
        enabled: true,
        version: "latest",
      },
    ];

    const result = prepareDefaultPlugins(expectedPlugins);

    expect(result).toEqual(expectedPlugins);
  });

  it("should return installed plugins if installed plugins contain a db plugin", () => {
    const expectedPlugins = [
      {
        id: "placeholder-id",
        pluginId: "plugin-id",
        npm: "plugin-npm",
        enabled: true,
        version: "latest",
      },
      {
        id: "postgres-id-123",
        pluginId: POSTGRESQL_PLUGIN_ID,
        npm: "@amplication/plugin-dotnet-db-postgres",
        enabled: true,
        version: "latest",
      },
    ];
    const result = prepareDefaultPlugins(expectedPlugins);

    expect(result).toStrictEqual(expectedPlugins);
  });
});
