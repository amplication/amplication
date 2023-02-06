/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as apollo from "apollo-server-express";
import * as nestAccessControl from "nest-access-control";
import { GqlDefaultAuthGuard } from "../../auth/gqlDefaultAuth.guard";
import * as gqlACGuard from "../../auth/gqlAC.guard";
import { isRecordNotFoundError } from "../../prisma.util";
import { MetaQueryPayload } from "../../util/MetaQueryPayload";
import { Public } from "../../decorators/public.decorator";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { CreatePluginArgs } from "./CreatePluginArgs";
import { UpdatePluginArgs } from "./UpdatePluginArgs";
import { DeletePluginArgs } from "./DeletePluginArgs";
import { PluginFindManyArgs } from "./PluginFindManyArgs";
import { PluginFindUniqueArgs } from "./PluginFindUniqueArgs";
import { Plugin } from "./Plugin";
import { PluginService } from "../plugin.service";

@graphql.Resolver(() => Plugin)
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
export class PluginResolverBase {
  constructor(
    protected readonly service: PluginService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @Public()
  @graphql.Query(() => MetaQueryPayload)
  async _pluginsMeta(
    @graphql.Args() args: PluginFindManyArgs
  ): Promise<MetaQueryPayload> {
    const results = await this.service.count({
      ...args,
      skip: undefined,
      take: undefined,
    });
    return {
      count: results,
    };
  }

  @Public()
  @graphql.Query(() => [Plugin])
  async plugins(@graphql.Args() args: PluginFindManyArgs): Promise<Plugin[]> {
    return this.service.findMany(args);
  }

  @Public()
  @graphql.Query(() => Plugin, { nullable: true })
  async plugin(
    @graphql.Args() args: PluginFindUniqueArgs
  ): Promise<Plugin | null> {
    const result = await this.service.findOne(args);
    if (result === null) {
      return null;
    }
    return result;
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => Plugin)
  @nestAccessControl.UseRoles({
    resource: "Plugin",
    action: "create",
    possession: "any",
  })
  async createPlugin(@graphql.Args() args: CreatePluginArgs): Promise<Plugin> {
    return await this.service.create({
      ...args,
      data: args.data,
    });
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => Plugin)
  @nestAccessControl.UseRoles({
    resource: "Plugin",
    action: "update",
    possession: "any",
  })
  async updatePlugin(
    @graphql.Args() args: UpdatePluginArgs
  ): Promise<Plugin | null> {
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

  @graphql.Mutation(() => Plugin)
  @nestAccessControl.UseRoles({
    resource: "Plugin",
    action: "delete",
    possession: "any",
  })
  async deletePlugin(
    @graphql.Args() args: DeletePluginArgs
  ): Promise<Plugin | null> {
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
