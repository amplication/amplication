import { Injectable } from "@nestjs/common";
import fs from "fs";
import {
  Plugin,
  PluginVersion,
  Prisma,
} from "../../prisma/generated-prisma-client";
import fetch from "node-fetch";
import zlib from "node:zlib";
import tar from "tar-stream";
import { PrismaService } from "../prisma/prisma.service";
import { PluginVersionServiceBase } from "./base/pluginVersion.service.base";
import { PluginService } from "../plugin/plugin.service";
import { NpmPluginVersionService } from "./npm-plugin-version.service";

@Injectable()
export class PluginVersionService extends PluginVersionServiceBase {
  constructor(
    protected readonly prisma: PrismaService,
    private pluginService: PluginService,
    private npmPluginVersionService: NpmPluginVersionService
  ) {
    super(prisma);
  }
  async upsert<T extends Prisma.PluginVersionUpsertArgs>(
    args: Prisma.SelectSubset<T, Prisma.PluginVersionUpsertArgs>
  ): Promise<PluginVersion> {
    return this.prisma.pluginVersion.upsert(args);
  }
  /**
   * get all saved plugin from DB
   * @returns Plugin[]
   */
  async getPlugins(): Promise<Plugin[]> {
    try {
      return await this.pluginService.findMany({});
    } catch (error) {}
  }
  /**
   * fetch the settings of a specific package version from npm as part of the creation of plugin version.
   * it search for `.amplicationrc.json
   * this function will run only one time, during the creation of a plugin version
   * @param tarBallUrl
   * @returns
   */
  async getPluginSettings(tarBallUrl: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const extract = tar.extract();
        extract.on("entry", async function (header, stream, next) {
          if (header.name === "package/.amplicationrc.json") {
            stream.on("data", (chunk) => {
              const data = Buffer.from(chunk);

              return resolve(data.toString().replace(/ |\n/g, ""));
            });
          }

          stream.on("end", function () {
            next();
          });

          stream.resume();
        });

        extract.on("finish", () => {
          return resolve("{}");
        });

        const res = await fetch(tarBallUrl);
        res.body.pipe(zlib.createGunzip()).pipe(extract);
      } catch (error) {
        console.log("getPluginSettings", error);
        reject(error);
      }
    });
  }
  /**
   * main service function.upsert all plugins versions into DB
   * @returns Plugin[]
   */
  async npmPluginsVersions() {
    try {
      const plugins = await this.getPlugins();
      if (!plugins || !plugins.length) throw "There are no plugins to get";

      const pluginsVersions =
        await this.npmPluginVersionService.updatePluginsVersion(plugins);
      if (!pluginsVersions.length) throw "Failed to fetch versions for plugin";

      const insertedPluginVersionArr: PluginVersion[] = [];
      for await (const versionData of pluginsVersions) {
        const {
          createdAt,
          pluginId,
          updatedAt,
          version,
          pluginIdVersion,
          tarballUrl,
        } = versionData;

        const isPluginVersionExist = await this.findOne({
          where: {
            pluginIdVersion,
          },
        });
        if (isPluginVersionExist) continue;

        const pluginSettings = await this.getPluginSettings(tarballUrl);
        const upsertPluginVersion = await this.upsert({
          where: {
            pluginIdVersion,
          },
          update: {
            settings: pluginSettings,
            updatedAt,
          },
          create: {
            pluginId,
            pluginIdVersion,
            settings: pluginSettings,
            version,
            createdAt,
            updatedAt,
          },
        });
        insertedPluginVersionArr.push(upsertPluginVersion);
      }

      return insertedPluginVersionArr;
    } catch (error) {
      console.log(error);
    }
  }
}
