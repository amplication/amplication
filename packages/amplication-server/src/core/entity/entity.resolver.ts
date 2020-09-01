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
  UpdateEntityPermissionArgs,
  LockEntityArgs,
  FindManyEntityFieldArgs,
  UpdateEntityPermissionRolesArgs,
  UpdateEntityPermissionFieldRolesArgs,
  AddEntityPermissionFieldArgs,
  DeleteEntityPermissionFieldArgs,
  CreateOneEntityFieldArgs,
  UpdateOneEntityFieldArgs
} from './dto';
import {
  Entity,
  EntityField,
  EntityVersion,
  EntityPermission,
  EntityPermissionField,
  User
} from 'src/models';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { EntityService } from './entity.service';
import { UserService } from '../user/user.service';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { InjectContextValue } from 'src/decorators/injectContextValue.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { InjectableResourceParameter } from 'src/enums/InjectableResourceParameter';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { UserEntity } from 'src/decorators/user.decorator';
import { FindOneArgs } from 'src/dto';

@Resolver(() => Entity)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class EntityResolver {
  constructor(
    private readonly entityService: EntityService,
    private readonly userService: UserService
  ) {}

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
  async fields(
    @Parent() entity: Entity,
    @Args() args: FindManyEntityFieldArgs
  ) {
    if (entity.fields && entity.fields.length) {
      return entity.fields;
    }
    //the fields property on the Entity always returns the fields of the current version (versionNumber=0)
    return this.entityService.getEntityFields(entity.id, 0, args);
  }

  @ResolveField(() => [EntityPermission])
  async permissions(@Parent() entity: Entity) {
    return this.entityService.getPermissions(entity.id);
  }

  @ResolveField(() => [EntityVersion])
  async entityVersions(
    @Parent() entity: Entity,
    @Args() args: FindManyEntityVersionArgs
  ) {
    return this.entityService.getVersions({
      ...args,
      where: { entity: { id: entity.id } }
    });
  }

  @ResolveField(() => [User])
  async lockedByUser(@Parent() entity: Entity) {
    if (entity.lockedByUserId) {
      return this.userService.findUser({
        where: {
          id: entity.lockedByUserId
        }
      });
    } else {
      return null;
    }
  }

  /**@todo: add authorization header  */
  @Mutation(() => EntityPermission, {
    nullable: true,
    description: undefined
  })
  async updateEntityPermission(
    @UserEntity() user: User,
    @Args() args: UpdateEntityPermissionArgs
  ): Promise<EntityPermission> {
    return this.entityService.updateEntityPermission(args, user);
  }

  /**@todo: add authorization header  */
  @Mutation(() => EntityPermission, {
    nullable: true,
    description: undefined
  })
  async updateEntityPermissionRoles(
    @UserEntity() user: User,
    @Args() args: UpdateEntityPermissionRolesArgs
  ): Promise<EntityPermission> {
    return this.entityService.updateEntityPermissionRoles(args, user);
  }

  /**@todo: add authorization header  */
  @Mutation(() => EntityPermissionField, {
    nullable: true,
    description: undefined
  })
  async addEntityPermissionField(
    @UserEntity() user: User,
    @Args() args: AddEntityPermissionFieldArgs
  ): Promise<EntityPermissionField> {
    return this.entityService.addEntityPermissionField(args, user);
  }

  /**@todo: add authorization header  */
  @Mutation(() => EntityPermissionField, {
    nullable: true,
    description: undefined
  })
  async deleteEntityPermissionField(
    @UserEntity() user: User,
    @Args() args: DeleteEntityPermissionFieldArgs
  ): Promise<EntityPermissionField> {
    return this.entityService.deleteEntityPermissionField(args, user);
  }

  /**@todo: add authorization header  */
  @Mutation(() => EntityPermissionField, {
    nullable: true,
    description: undefined
  })
  async updateEntityPermissionFieldRoles(
    @UserEntity() user: User,
    @Args() args: UpdateEntityPermissionFieldRolesArgs
  ): Promise<EntityPermissionField> {
    return this.entityService.updateEntityPermissionFieldRoles(args, user);
  }

  @Mutation(() => EntityField, {
    nullable: true,
    description: undefined
  })
  async createEntityField(
    @UserEntity() user: User,
    @Args() args: CreateOneEntityFieldArgs
  ): Promise<EntityField> {
    return this.entityService.createField(args, user);
  }

  @Mutation(() => EntityField, {
    nullable: true,
    description: undefined
  })
  async deleteEntityField(
    @UserEntity() user: User,
    @Args() args: FindOneArgs
  ): Promise<EntityField | null> {
    return this.entityService.deleteField(args, user);
  }

  @Mutation(() => EntityField, {
    nullable: true,
    description: undefined
  })
  async updateEntityField(
    @UserEntity() user: User,
    @Args() args: UpdateOneEntityFieldArgs
  ): Promise<EntityField | null> {
    return this.entityService.updateField(args, user);
  }
}
