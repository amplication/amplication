import * as gqlACGuard from "../auth/gqlAC.guard";
import { GqlDefaultAuthGuard } from "../auth/gqlDefaultAuth.guard";
import { AclValidateRequestInterceptor } from "../interceptors/aclValidateRequest.interceptor";
import { ConversationType } from "./base/ConversationType";
import { ConversationTypeResolverBase } from "./base/conversationType.resolver.base";
import { ConversationTypeService } from "./conversationType.service";
import { CreateConversation } from "./dto/GetConversation.dto";
import { CreateConversationInput } from "./dto/GetConversationInput.dto";
import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";

@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
@graphql.Resolver(() => ConversationType)
export class ConversationTypeResolver extends ConversationTypeResolverBase {
  constructor(
    protected readonly service: ConversationTypeService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => CreateConversation)
  @nestAccessControl.UseRoles({
    resource: "ConversationType",
    action: "create",
    possession: "any",
  })
  async createConversation(
    @graphql.Args("data")
    args: CreateConversationInput
  ): Promise<CreateConversation> {
    const conversation = await this.service.startConversionSync(args);
    return {
      success: conversation.success,
      requestUniqueId: conversation.requestUniqueId,
      result: conversation.result ? conversation.result : null,
      errorMessage: conversation.result ? null : conversation.result,
    };
  }
}
