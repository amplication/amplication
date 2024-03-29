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
import { ConversationType } from "./ConversationType";
import { ConversationTypeCountArgs } from "./ConversationTypeCountArgs";
import { ConversationTypeFindManyArgs } from "./ConversationTypeFindManyArgs";
import { ConversationTypeFindUniqueArgs } from "./ConversationTypeFindUniqueArgs";
import { CreateConversationTypeArgs } from "./CreateConversationTypeArgs";
import { UpdateConversationTypeArgs } from "./UpdateConversationTypeArgs";
import { DeleteConversationTypeArgs } from "./DeleteConversationTypeArgs";
import { Template } from "../../template/base/Template";
import { ConversationTypeService } from "../conversationType.service";
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
@graphql.Resolver(() => ConversationType)
export class ConversationTypeResolverBase {
  constructor(
    protected readonly service: ConversationTypeService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @graphql.Query(() => MetaQueryPayload)
  @nestAccessControl.UseRoles({
    resource: "ConversationType",
    action: "read",
    possession: "any",
  })
  async _conversationTypesMeta(
    @graphql.Args() args: ConversationTypeCountArgs
  ): Promise<MetaQueryPayload> {
    const result = await this.service.count(args);
    return {
      count: result,
    };
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @graphql.Query(() => [ConversationType])
  @nestAccessControl.UseRoles({
    resource: "ConversationType",
    action: "read",
    possession: "any",
  })
  async conversationTypes(
    @graphql.Args() args: ConversationTypeFindManyArgs
  ): Promise<ConversationType[]> {
    return this.service.conversationTypes(args);
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @graphql.Query(() => ConversationType, { nullable: true })
  @nestAccessControl.UseRoles({
    resource: "ConversationType",
    action: "read",
    possession: "own",
  })
  async conversationType(
    @graphql.Args() args: ConversationTypeFindUniqueArgs
  ): Promise<ConversationType | null> {
    const result = await this.service.conversationType(args);
    if (result === null) {
      return null;
    }
    return result;
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => ConversationType)
  @nestAccessControl.UseRoles({
    resource: "ConversationType",
    action: "create",
    possession: "any",
  })
  async createConversationType(
    @graphql.Args() args: CreateConversationTypeArgs
  ): Promise<ConversationType> {
    return await this.service.createConversationType({
      ...args,
      data: {
        ...args.data,

        template: args.data.template
          ? {
              connect: args.data.template,
            }
          : undefined,
      },
    });
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => ConversationType)
  @nestAccessControl.UseRoles({
    resource: "ConversationType",
    action: "update",
    possession: "any",
  })
  async updateConversationType(
    @graphql.Args() args: UpdateConversationTypeArgs
  ): Promise<ConversationType | null> {
    try {
      return await this.service.updateConversationType({
        ...args,
        data: {
          ...args.data,

          template: args.data.template
            ? {
                connect: args.data.template,
              }
            : undefined,
        },
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

  @graphql.Mutation(() => ConversationType)
  @nestAccessControl.UseRoles({
    resource: "ConversationType",
    action: "delete",
    possession: "any",
  })
  async deleteConversationType(
    @graphql.Args() args: DeleteConversationTypeArgs
  ): Promise<ConversationType | null> {
    try {
      return await this.service.deleteConversationType(args);
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
  @graphql.ResolveField(() => Template, {
    nullable: true,
    name: "template",
  })
  @nestAccessControl.UseRoles({
    resource: "Template",
    action: "read",
    possession: "any",
  })
  async getTemplate(
    @graphql.Parent() parent: ConversationType
  ): Promise<Template | null> {
    const result = await this.service.getTemplate(parent.id);

    if (!result) {
      return null;
    }
    return result;
  }
}
