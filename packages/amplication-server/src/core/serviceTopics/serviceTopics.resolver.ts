import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { BlockTypeResolver } from "../block/blockType.resolver";
import { CreateServiceTopicsArgs } from "./dto/CreateServiceTopicsArgs";
import { DeleteServiceTopicsArgs } from "./dto/DeleteServiceTopicsArgs";
import { FindManyServiceTopicsArgs } from "./dto/FindManyServiceTopicsArgs";
import { ServiceTopics } from "./dto/ServiceTopics";
import { UpdateServiceTopicsArgs } from "./dto/UpdateServiceTopicsArgs";
import { ServiceTopicsService } from "./serviceTopics.service";
import { UseFilters, UseGuards } from "@nestjs/common";
import { Resolver } from "@nestjs/graphql";

@Resolver(() => ServiceTopics)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ServiceTopicsResolver extends BlockTypeResolver(
  ServiceTopics,
  "serviceTopicsList",
  FindManyServiceTopicsArgs,
  "createServiceTopics",
  CreateServiceTopicsArgs,
  "updateServiceTopics",
  UpdateServiceTopicsArgs,
  "deleteServiceTopics",
  DeleteServiceTopicsArgs
) {
  constructor(private readonly service: ServiceTopicsService) {
    super();
  }
}
