import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { AssistantService } from "./assistant.service";
import { AssistantThread } from "./dto/AssistantThread";
import { SendAssistantMessageArgs } from "./dto/SendAssistantMessageArgs";
import { UserEntity } from "../../decorators/user.decorator";
import { User } from "../../models";

@Resolver(() => AssistantThread)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class AssistantResolver {
  constructor(private readonly service: AssistantService) {}

  @Mutation(() => AssistantThread)
  async sendAssistantMessage(
    @UserEntity() user: User,
    @Args() args: SendAssistantMessageArgs
  ): Promise<AssistantThread> {
    args.context.user = user;
    args.context.workspaceId = user.workspace.id;

    return this.service.processMessage(
      args.data.message,
      args.data.threadId,
      args.context
    );
  }
}
