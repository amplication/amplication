import { Args, Resolver, Parent, ResolveField } from '@nestjs/graphql';
import { UseFilters, UseGuards } from '@nestjs/common';
import { FindManyEntityFieldArgs } from './dto';
import { EntityVersion, Commit, EntityField } from 'src/models';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { EntityService } from './entity.service';

import { GqlAuthGuard } from 'src/guards/gql-auth.guard';

@Resolver(() => EntityVersion)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class EntityVersionResolver {
  constructor(private readonly entityService: EntityService) {}

  @ResolveField(() => Commit)
  async commit(@Parent() entityVersion: EntityVersion) {
    return this.entityService.getVersionCommit(entityVersion.id);
  }

  @ResolveField(() => [EntityField])
  async fields(
    @Parent() entityVersion: EntityVersion,
    @Args() args: FindManyEntityFieldArgs
  ) {
    const { entityId, versionNumber } = entityVersion;

    return this.entityService.getVersionFields(entityId, versionNumber, args);
  }

  @ResolveField(() => [EntityField])
  async permissions(@Parent() entityVersion: EntityVersion) {
    const { entityId, versionNumber } = entityVersion;

    return this.entityService.getVersionPermissions(entityId, versionNumber);
  }
}
