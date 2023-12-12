/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import * as graphql from "@nestjs/graphql";
import * as apollo from "apollo-server-express";
import { isRecordNotFoundError } from "../../prisma.util";
import { MetaQueryPayload } from "../../util/MetaQueryPayload";
import { Public } from "../../decorators/public.decorator";
import { CreatePluginVersionArgs } from "./CreatePluginVersionArgs";
import { UpdatePluginVersionArgs } from "./UpdatePluginVersionArgs";
import { DeletePluginVersionArgs } from "./DeletePluginVersionArgs";
import { PluginVersionCountArgs } from "./PluginVersionCountArgs";
import { PluginVersionFindManyArgs } from "./PluginVersionFindManyArgs";
import { PluginVersionFindUniqueArgs } from "./PluginVersionFindUniqueArgs";
import { PluginVersion } from "./PluginVersion";
import { PluginVersionService } from "../pluginVersion.service";
@graphql.Resolver(() => PluginVersion)
export class PluginVersionResolverBase {
  constructor(protected readonly service: PluginVersionService) {}

  async _pluginVersionsMeta(
    @graphql.Args() args: PluginVersionCountArgs
  ): Promise<MetaQueryPayload> {
    const result = await this.service.count(args);
    return {
      count: result,
    };
  }

  @Public()
  @graphql.Query(() => [PluginVersion])
  async pluginVersions(
    @graphql.Args() args: PluginVersionFindManyArgs
  ): Promise<PluginVersion[]> {
    return this.service.findMany(args);
  }

  @Public()
  @graphql.Query(() => PluginVersion, { nullable: true })
  async pluginVersion(
    @graphql.Args() args: PluginVersionFindUniqueArgs
  ): Promise<PluginVersion | null> {
    const result = await this.service.findOne(args);
    if (result === null) {
      return null;
    }
    return result;
  }

  @graphql.Mutation(() => PluginVersion)
  async createPluginVersion(
    @graphql.Args() args: CreatePluginVersionArgs
  ): Promise<PluginVersion> {
    return await this.service.create({
      ...args,
      data: args.data,
    });
  }

  @graphql.Mutation(() => PluginVersion)
  async updatePluginVersion(
    @graphql.Args() args: UpdatePluginVersionArgs
  ): Promise<PluginVersion | null> {
    try {
      return await this.service.update({
        ...args,
        data: args.data,
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new apollo.ApolloError(
          `No resource was found for ${JSON.stringify(args.where)}`
        );
      }
      throw error;
    }
  }

  @graphql.Mutation(() => PluginVersion)
  async deletePluginVersion(
    @graphql.Args() args: DeletePluginVersionArgs
  ): Promise<PluginVersion | null> {
    try {
      return await this.service.delete(args);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new apollo.ApolloError(
          `No resource was found for ${JSON.stringify(args.where)}`
        );
      }
      throw error;
    }
  }
}
