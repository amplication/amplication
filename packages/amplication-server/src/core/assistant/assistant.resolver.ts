import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Subscription } from "@nestjs/graphql";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { AssistantService } from "./assistant.service";
import { AssistantThread } from "./dto/AssistantThread";
import { SendAssistantMessageArgs } from "./dto/SendAssistantMessageArgs";
import { UserEntity } from "../../decorators/user.decorator";
import { User } from "../../models";
import { AssistantMessageDelta } from "./dto/AssistantMessageDelta";
import { KafkaMessage } from "kafkajs";
import { AuthUser } from "../auth/types";

@Resolver(() => AssistantThread)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class AssistantResolver {
  constructor(private readonly service: AssistantService) {}

  @Subscription(() => AssistantMessageDelta, {
    resolve: (payload) => {
      return JSON.parse(payload.value.toString());
    },
    filter: (payload: KafkaMessage, variables) => {
      const parsedPayload = JSON.parse(payload.value.toString());

      return (
        (parsedPayload as AssistantMessageDelta).threadId === variables.threadId
      );
    },
  })
  async assistantMessageUpdated(
    @UserEntity() user: User,
    @Args("threadId") threadId: string
  ) {
    return this.service.subscribeToAssistantMessageUpdated();
  }

  @Mutation(() => AssistantThread)
  async sendAssistantMessageWithStream(
    @UserEntity() user: AuthUser,
    @Args() args: SendAssistantMessageArgs
  ): Promise<AssistantThread> {
    args.context.user = user;
    args.context.workspaceId = user.workspace.id;

    return this.service.processMessageWithStream(
      args.data.message,
      args.data.threadId,
      args.context,
      args.data.messageType
    );
  }
}
