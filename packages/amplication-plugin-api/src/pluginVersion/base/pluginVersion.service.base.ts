/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import { Prisma, PluginVersion } from "../../../prisma/generated-prisma-client";
import { PrismaService } from "../../prisma/prisma.service";

export class PluginVersionServiceBase {
  constructor(protected readonly prisma: PrismaService) {}

  async count<T extends Prisma.PluginVersionCountArgs>(
    args: Prisma.SelectSubset<T, Prisma.PluginVersionCountArgs>
  ): Promise<number> {
    return this.prisma.pluginVersion.count(args);
  }

  async findMany<T extends Prisma.PluginVersionFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.PluginVersionFindManyArgs>
  ): Promise<PluginVersion[]> {
    return this.prisma.pluginVersion.findMany(args);
  }
  async findOne<T extends Prisma.PluginVersionFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.PluginVersionFindUniqueArgs>
  ): Promise<PluginVersion | null> {
    return await this.prisma.pluginVersion.findUnique(args);
  }
  async create<T extends Prisma.PluginVersionCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.PluginVersionCreateArgs>
  ): Promise<PluginVersion> {
    return this.prisma.pluginVersion.create<T>(args);
  }
  async update<T extends Prisma.PluginVersionUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.PluginVersionUpdateArgs>
  ): Promise<PluginVersion> {
    return this.prisma.pluginVersion.update<T>(args);
  }
  async delete<T extends Prisma.PluginVersionDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.PluginVersionDeleteArgs>
  ): Promise<PluginVersion> {
    return this.prisma.pluginVersion.delete(args);
  }
}
