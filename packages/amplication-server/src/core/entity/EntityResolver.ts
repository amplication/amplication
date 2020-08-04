import {
  Args,
  Mutation,
  Query,
  Resolver,
  Parent,
  ResolveField
} from '@nestjs/graphql';
import { UseFilters } from '@nestjs/common';
import {
  CreateOneEntityArgs,
  CreateOneEntityVersionArgs,
  FindManyEntityArgs,
  UpdateOneEntityArgs,
  FindOneEntityArgs,
  FindManyEntityVersionArgs,
  DeleteOneEntityArgs,
  UpdateEntityPermissionsArgs
} from './dto';
import {
  Entity,
  EntityField,
  EntityVersion,
  EntityPermission
} from 'src/models';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { EntityService } from './entity.service';

@Resolver(() => Entity)
@UseFilters(GqlResolverExceptionsFilter)
export class EntityResolver {
  constructor(private readonly entityService: EntityService) {}
  @Query(() => Entity, {
    nullable: true,
    description: undefined
  })
  async entity(@Args() args: FindOneEntityArgs): Promise<Entity | null> {
    return this.entityService.entity(args);
  }

  @Query(() => [Entity], {
    nullable: false,
    description: undefined
  })
  async entities(@Args() args: FindManyEntityArgs): Promise<Entity[]> {
    return this.entityService.entities(args);
  }

  @Mutation(() => Entity, {
    nullable: false,
    description: undefined
  })
  async createOneEntity(@Args() args: CreateOneEntityArgs): Promise<Entity> {
    return this.entityService.createOneEntity(args);
  }

  @Mutation(() => Entity, {
    nullable: true,
    description: undefined
  })
  async deleteOneEntity(
    @Args() args: DeleteOneEntityArgs
  ): Promise<Entity | null> {
    return this.entityService.deleteOneEntity(args);
  }

  @Mutation(() => Entity, {
    nullable: true,
    description: undefined
  })
  async updateEntity(
    @Args() args: UpdateOneEntityArgs
  ): Promise<Entity | null> {
    return this.entityService.updateOneEntity(args);
  }

  @Mutation(() => EntityVersion, {
    nullable: false,
    description: undefined
  })
  async createVersion(
    @Args() args: CreateOneEntityVersionArgs
  ): Promise<EntityVersion> {
    return this.entityService.createVersion(args);
  }

  @ResolveField(() => [EntityField])
  async fields(@Parent() entity: Entity) {
    if (entity.fields && entity.fields.length) {
      return entity.fields;
    }
    return this.entityService.getEntityFields(entity);
  }

  @Query(() => [EntityVersion], {
    nullable: false,
    description: undefined
  })
  async entityVersions(
    @Args() args: FindManyEntityVersionArgs
  ): Promise<EntityVersion[]> {
    return this.entityService.getVersions(args);
  }

  @Mutation(() => [EntityPermission], {
    nullable: true,
    description: undefined
  })
  async updateEntityPermissions(
    @Args() args: UpdateEntityPermissionsArgs
  ): Promise<EntityPermission[] | null> {
    return this.entityService.updateEntityPermissions(args);
  }
}
