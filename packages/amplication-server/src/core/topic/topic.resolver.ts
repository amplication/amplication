import { Resolver } from "@nestjs/graphql";
import { TopicService } from "./topic.service";
import { FindManyTopicArgs } from "./dto/FindManyTopicArgs";
import { BlockTypeResolver } from "../block/blockType.resolver";
import { Topic } from "./dto/Topic";
import { CreateTopicArgs } from "./dto/CreateTopicArgs";
import { UpdateTopicArgs } from "./dto/UpdateTopicArgs";
import { DeleteTopicArgs } from "./dto/DeleteTopicArgs";
import { UseFilters, UseGuards } from "@nestjs/common";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";

@Resolver(() => Topic)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class TopicResolver extends BlockTypeResolver(
  Topic,
  "Topics",
  FindManyTopicArgs,
  "createTopic",
  CreateTopicArgs,
  "updateTopic",
  UpdateTopicArgs,
  "deleteTopic",
  DeleteTopicArgs
) {
  constructor(private readonly service: TopicService) {
    super();
  }
}
