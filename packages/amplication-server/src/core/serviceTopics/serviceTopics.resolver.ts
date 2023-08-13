import { Resolver } from "@nestjs/graphql";
import { ServiceTopicsService } from "./serviceTopics.service";
import { FindManyServiceTopicsArgs } from "./dto/FindManyServiceTopicsArgs";
import { BlockTypeResolver } from "../block/blockType.resolver";
import { ServiceTopics } from "./dto/ServiceTopics";
import { CreateServiceTopicsArgs } from "./dto/CreateServiceTopicsArgs";
import { UpdateServiceTopicsArgs } from "./dto/UpdateServiceTopicsArgs";
import { DeleteServiceTopicsArgs } from "./dto/DeleteServiceTopicsArgs";
import { UseFilters, UseGuards } from "@nestjs/common";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";

@Resolver(() => ServiceTopics)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ServiceTopicsResolver extends BlockTypeResolver(
  ServiceTopics,
  "ServiceTopicsList",
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
