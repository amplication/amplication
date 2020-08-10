import {
  Args,
  Mutation,
  Query,
  Resolver,
  Parent,
  ResolveField
} from '@nestjs/graphql';
import { UseFilters, UseGuards } from '@nestjs/common';
import {
  CreateOneEntityArgs,
  FindManyEntityArgs,
  UpdateOneEntityArgs,
  FindOneEntityArgs,
  FindManyEntityVersionArgs,
  DeleteOneEntityArgs,
  UpdateEntityPermissionsArgs,
  LockEntityArgs
} from './dto';
import {
  Entity,
  EntityField,
  EntityVersion,
  EntityPermission,
  User
} from 'src/models';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { EntityService } from './entity.service';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { InjectContextValue } from 'src/decorators/injectContextValue.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { InjectableResourceParameter } from 'src/enums/InjectableResourceParameter';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { UserEntity } from 'src/decorators/user.decorator';

@Resolver(() => Entity)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class EntityResolver {
  constructor(private readonly entityService: EntityService) {}

  @Query(() => Entity, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.EntityId, 'where.id')
  async entity(@Args() args: FindOneEntityArgs): Promise<Entity | null> {
    return this.entityService.entity(args);
  }

  @Query(() => [Entity], {
    nullable: false,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.app.id')
  async entities(@Args() args: FindManyEntityArgs): Promise<Entity[]> {
    return this.entityService.entities(args);
  }

  @Mutation(() => Entity, {
    nullable: false,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'data.app.connect.id')
  async createOneEntity(
    @UserEntity() user: User,
    @Args() args: CreateOneEntityArgs
  ): Promise<Entity> {
    return this.entityService.createOneEntity(args, user);
  }

  @Mutation(() => Entity, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.EntityId, 'where.id')
  async deleteEntity(
    @UserEntity() user: User,
    @Args() args: DeleteOneEntityArgs
  ): Promise<Entity | null> {
    return this.entityService.deleteOneEntity(args, user);
  }

  @Mutation(() => Entity, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.EntityId, 'where.id')
  async updateEntity(
    @UserEntity() user: User,
    @Args() args: UpdateOneEntityArgs
  ): Promise<Entity | null> {
    return this.entityService.updateOneEntity(args, user);
  }

  @Mutation(() => Entity, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.EntityId, 'where.id')
  @InjectContextValue(InjectableResourceParameter.UserId, 'userId')
  async lockEntity(
    @UserEntity() user: User,
    @Args() args: LockEntityArgs
  ): Promise<Entity | null> {
    return this.entityService.acquireLock(args, user);
  }

  @ResolveField(() => [EntityField])
  async fields(@Parent() entity: Entity) {
    if (entity.fields && entity.fields.length) {
      return entity.fields;
    }
    return this.entityService.getEntityFields(entity);
  }

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

  /**@todo: add authorization header  */
  @Mutation(() => [EntityPermission], {
    nullable: true,
    description: undefined
  })
  async updateEntityPermissions(
    @UserEntity() user: User,
    @Args() args: UpdateEntityPermissionsArgs
  ): Promise<EntityPermission[] | null> {
    return this.entityService.updateEntityPermissions(args, user);
  }
}
