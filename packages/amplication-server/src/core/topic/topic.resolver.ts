import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { BlockTypeResolver } from "../block/blockType.resolver";
import { CreateTopicArgs } from "./dto/CreateTopicArgs";
import { DeleteTopicArgs } from "./dto/DeleteTopicArgs";
import { FindManyTopicArgs } from "./dto/FindManyTopicArgs";
import { Topic } from "./dto/Topic";
import { UpdateTopicArgs } from "./dto/UpdateTopicArgs";
import { TopicService } from "./topic.service";
import { UseFilters, UseGuards } from "@nestjs/common";
import { Resolver } from "@nestjs/graphql";

@Resolver(() => Topic)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class TopicResolver extends BlockTypeResolver(
  Topic,
  "topics",
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
