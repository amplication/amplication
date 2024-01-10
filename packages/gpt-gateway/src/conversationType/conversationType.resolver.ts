import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
import * as gqlACGuard from "../auth/gqlAC.guard";
import { GqlDefaultAuthGuard } from "../auth/gqlDefaultAuth.guard";
import * as common from "@nestjs/common";
import { ConversationTypeResolverBase } from "./base/conversationType.resolver.base";
import { ConversationType } from "./base/ConversationType";
import { ConversationTypeService } from "./conversationType.service";
import { AclValidateRequestInterceptor } from "../interceptors/aclValidateRequest.interceptor";
import { CreateConversationInput } from "./dto/GetConversationInput.dto";
import { CreateConversation } from "./dto/GetConversation.dto";

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
      isGptConversionCompleted: conversation.isCompleted,
      requestUniqueId: conversation.requestUniqueId,
      result: conversation.isCompleted ? conversation.result : null,
      errorMessage: conversation.isCompleted ? null : conversation.result,
    };
  }
}
