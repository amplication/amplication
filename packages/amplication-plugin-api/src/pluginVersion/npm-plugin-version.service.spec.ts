/* eslint-disable @typescript-eslint/naming-convention */
import { NpmPluginVersionService } from "./npm-plugin-version.service";
import { Plugin } from "../../prisma/generated-prisma-client";

const DEPRECATED_NPM = "@amplication/my-deprecated-plugin";
const NPM_PACKAGE = "@amplication/my-plugin";

const plugins = [
  {
    name: "my-deprecated-plugin",
    npm: DEPRECATED_NPM,
    pluginId: "my-deprecated-plugin-id",
  },
  {
    name: "my-plugin",
    npm: NPM_PACKAGE,
    pluginId: "my-plugin-id",
  },
] as Plugin[];

jest.mock("node-fetch", () =>
  jest.fn().mockImplementation((url: RequestInfo) => {
    if (url.toString().indexOf(NPM_PACKAGE) > 0) {
      return {
        json: jest.fn().mockResolvedValue({
          name: "my-plugin",
          "dist-tags": { latest: "2.0.0" },
          versions: {
            "1.0.0": {
              version: "1.0.0",
              name: "my-plugin",
              description: "A test package",
              dist: {
                tarball:
                  "https://registry.npmjs.org/my-plugin/-/my-plugin-1.0.0.tgz",
              },
            },
            "2.0.0": {
              version: "1.0.0",
              name: "my-plugin",
              description: "A test package",
              dist: {
                tarball:
                  "https://registry.npmjs.org/my-plugin/-/my-plugin-2.0.0.tgz",
              },
              deprecated: "Some reasons",
            },
          },
        }),
      };
    }
    if (url.toString().indexOf(DEPRECATED_NPM) > 0) {
      return {
        json: jest.fn().mockResolvedValue({
          name: "my-deprecated-plugin",
          "dist-tags": { latest: "1.0.0" },
          versions: {
            "1.0.0": {
              version: "1.0.0",
              name: "my-deprecated-plugin",
              description: "A test package",
              dist: {
                tarball:
                  "https://registry.npmjs.org/my-deprecated-plugin/-/my-deprecated-plugin-1.0.0.tgz",
              },
              deprecated: "Use the latest version",
            },
          },
        }),
      };
    }
    return {
      json: jest.fn(),
    };
  })
);

describe("NpmPluginVersionService", () => {
  let service: NpmPluginVersionService;

  beforeEach(() => {
    service = new NpmPluginVersionService();
  });

  describe("updatePluginsVersion", () => {
    it("should return an array of structured plugin versions that are not deprecated", async () => {
      const expectedPlugin = plugins.find((x) => x.npm === NPM_PACKAGE);

      const result = await service.updatePluginsVersion(plugins);

      expect(result).toEqual([
        {
          createdAt: expect.any(Date),
          id: "",
          pluginId: expectedPlugin.pluginId,
          pluginIdVersion: `${expectedPlugin.pluginId}_1.0.0`,
          settings: "{}",
          updatedAt: expect.any(Date),
          version: "1.0.0",
          tarballUrl:
            "https://registry.npmjs.org/my-plugin/-/my-plugin-1.0.0.tgz",
        },
        // ... other versions
      ]);
    });
  });
});
