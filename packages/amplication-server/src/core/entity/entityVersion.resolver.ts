import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import {
  EntityVersion,
  Commit,
  EntityField,
  EntityPermission,
} from "../../models";
import { FindManyEntityFieldArgs } from "./dto";
import { EntityService } from "./entity.service";
import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Resolver, Parent, ResolveField } from "@nestjs/graphql";

@Resolver(() => EntityVersion)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class EntityVersionResolver {
  constructor(private readonly entityService: EntityService) {}

  @ResolveField(() => Commit)
  async commit(@Parent() entityVersion: EntityVersion): Promise<Commit> {
    return this.entityService.getVersionCommit(entityVersion.id);
  }

  @ResolveField(() => [EntityField])
  async fields(
    @Parent() entityVersion: EntityVersion,
    @Args() args: FindManyEntityFieldArgs
  ): Promise<EntityField[]> {
    const { entityId, versionNumber } = entityVersion;

    return this.entityService.getVersionFields(entityId, versionNumber, args);
  }

  @ResolveField(() => [EntityField])
  async permissions(
    @Parent() entityVersion: EntityVersion
  ): Promise<EntityPermission[]> {
    const { entityId, versionNumber } = entityVersion;

    return this.entityService.getVersionPermissions(entityId, versionNumber);
  }
}
