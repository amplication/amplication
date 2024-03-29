/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import * as graphql from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { isRecordNotFoundError } from "../../prisma.util";
import { MetaQueryPayload } from "../../util/MetaQueryPayload";
import * as nestAccessControl from "nest-access-control";
import * as gqlACGuard from "../../auth/gqlAC.guard";
import { GqlDefaultAuthGuard } from "../../auth/gqlDefaultAuth.guard";
import * as common from "@nestjs/common";
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { Model } from "./Model";
import { ModelCountArgs } from "./ModelCountArgs";
import { ModelFindManyArgs } from "./ModelFindManyArgs";
import { ModelFindUniqueArgs } from "./ModelFindUniqueArgs";
import { CreateModelArgs } from "./CreateModelArgs";
import { UpdateModelArgs } from "./UpdateModelArgs";
import { DeleteModelArgs } from "./DeleteModelArgs";
import { TemplateFindManyArgs } from "../../template/base/TemplateFindManyArgs";
import { Template } from "../../template/base/Template";
import { ModelService } from "../model.service";
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
@graphql.Resolver(() => Model)
export class ModelResolverBase {
  constructor(
    protected readonly service: ModelService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @graphql.Query(() => MetaQueryPayload)
  @nestAccessControl.UseRoles({
    resource: "Model",
    action: "read",
    possession: "any",
  })
  async _modelsMeta(
    @graphql.Args() args: ModelCountArgs
  ): Promise<MetaQueryPayload> {
    const result = await this.service.count(args);
    return {
      count: result,
    };
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @graphql.Query(() => [Model])
  @nestAccessControl.UseRoles({
    resource: "Model",
    action: "read",
    possession: "any",
  })
  async models(@graphql.Args() args: ModelFindManyArgs): Promise<Model[]> {
    return this.service.models(args);
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @graphql.Query(() => Model, { nullable: true })
  @nestAccessControl.UseRoles({
    resource: "Model",
    action: "read",
    possession: "own",
  })
  async model(
    @graphql.Args() args: ModelFindUniqueArgs
  ): Promise<Model | null> {
    const result = await this.service.model(args);
    if (result === null) {
      return null;
    }
    return result;
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => Model)
  @nestAccessControl.UseRoles({
    resource: "Model",
    action: "create",
    possession: "any",
  })
  async createModel(@graphql.Args() args: CreateModelArgs): Promise<Model> {
    return await this.service.createModel({
      ...args,
      data: args.data,
    });
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => Model)
  @nestAccessControl.UseRoles({
    resource: "Model",
    action: "update",
    possession: "any",
  })
  async updateModel(
    @graphql.Args() args: UpdateModelArgs
  ): Promise<Model | null> {
    try {
      return await this.service.updateModel({
        ...args,
        data: args.data,
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new GraphQLError(
          `No resource was found for ${JSON.stringify(args.where)}`
        );
      }
      throw error;
    }
  }

  @graphql.Mutation(() => Model)
  @nestAccessControl.UseRoles({
    resource: "Model",
    action: "delete",
    possession: "any",
  })
  async deleteModel(
    @graphql.Args() args: DeleteModelArgs
  ): Promise<Model | null> {
    try {
      return await this.service.deleteModel(args);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new GraphQLError(
          `No resource was found for ${JSON.stringify(args.where)}`
        );
      }
      throw error;
    }
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @graphql.ResolveField(() => [Template], { name: "templates" })
  @nestAccessControl.UseRoles({
    resource: "Template",
    action: "read",
    possession: "any",
  })
  async findTemplates(
    @graphql.Parent() parent: Model,
    @graphql.Args() args: TemplateFindManyArgs
  ): Promise<Template[]> {
    const results = await this.service.findTemplates(parent.id, args);

    if (!results) {
      return [];
    }

    return results;
  }
}
