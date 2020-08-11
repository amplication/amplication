import { Args, Query, Resolver, Parent, ResolveField } from '@nestjs/graphql';
import { UseFilters, UseGuards } from '@nestjs/common';
import { FindManyEntityVersionArgs, FindManyEntityFieldArgs } from './dto';
import { EntityVersion, Commit, EntityField } from 'src/models';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { EntityService } from './entity.service';

import { GqlAuthGuard } from 'src/guards/gql-auth.guard';

@Resolver(() => EntityVersion)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class EntityVersionResolver {
  constructor(private readonly entityService: EntityService) {}

  /**@todo: add authorization header  */
  @Query(() => [EntityVersion], {
    nullable: false,
    description: undefined
  })
  async entityVersions(
    @Args() args: FindManyEntityVersionArgs
  ): Promise<EntityVersion[]> {
    return this.entityService.getVersions(args);
  }

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

    return this.entityService.getEntityFields(entityId, versionNumber, args);
  }
}
