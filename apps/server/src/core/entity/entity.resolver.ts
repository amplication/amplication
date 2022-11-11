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
  Entity,
  EntityField,
  EntityVersion,
  EntityPermission,
  EntityPermissionField,
  User
} from '../../models';
import { FindOneArgs } from '../../dto';
import { AuthorizeContext } from '../../decorators/authorizeContext.decorator';
import { InjectContextValue } from '../../decorators/injectContextValue.decorator';
import { UserEntity } from '../../decorators/user.decorator';
import { AuthorizableOriginParameter } from '../../enums/AuthorizableOriginParameter';
import { InjectableOriginParameter } from '../../enums/InjectableOriginParameter';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { GqlResolverExceptionsFilter } from '../../filters/GqlResolverExceptions.filter';
import { UserService } from '../user/user.service';
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
  CreateOneEntityFieldByDisplayNameArgs,
  UpdateOneEntityFieldArgs,
  CreateDefaultRelatedFieldArgs
} from './dto';
import { EntityService } from './entity.service';

@Resolver(() => Entity)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class EntityResolver {
  constructor(
    private readonly entityService: EntityService,
    private readonly userService: UserService
  ) {}

  @Query(() => Entity, {
    nullable: true
  })
  @AuthorizeContext(AuthorizableOriginParameter.EntityId, 'where.id')
  async entity(@Args() args: FindOneEntityArgs): Promise<Entity | null> {
    return this.entityService.entity(args);
  }

  @Query(() => [Entity], {
    nullable: false
  })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, 'where.resource.id')
  async entities(@Args() args: FindManyEntityArgs): Promise<Entity[]> {
    return this.entityService.entities(args);
  }

  @Mutation(() => Entity, {
    nullable: false
  })
  @AuthorizeContext(
    AuthorizableOriginParameter.ResourceId,
    'data.resource.connect.id'
  )
  async createOneEntity(
    @UserEntity() user: User,
    @Args() args: CreateOneEntityArgs
  ): Promise<Entity> {
    return this.entityService.createOneEntity(args, user);
  }

  @Mutation(() => Entity, {
    nullable: true
  })
  @AuthorizeContext(AuthorizableOriginParameter.EntityId, 'where.id')
  async deleteEntity(
    @UserEntity() user: User,
    @Args() args: DeleteOneEntityArgs
  ): Promise<Entity | null> {
    return this.entityService.deleteOneEntity(args, user);
  }

  @Mutation(() => Entity, {
    nullable: true
  })
  @AuthorizeContext(AuthorizableOriginParameter.EntityId, 'where.id')
  async updateEntity(
    @UserEntity() user: User,
    @Args() args: UpdateOneEntityArgs
  ): Promise<Entity | null> {
    return this.entityService.updateOneEntity(args, user);
  }

  @Mutation(() => Entity, {
    nullable: true
  })
  @AuthorizeContext(AuthorizableOriginParameter.EntityId, 'where.id')
  @InjectContextValue(InjectableOriginParameter.UserId, 'userId')
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
  ): Promise<EntityField[]> {
    //the fields property on the Entity always returns the fields of the current version (versionNumber=0)
    return this.entityService.getFields(entity.id, args);
  }

  @ResolveField(() => [EntityPermission])
  async permissions(@Parent() entity: Entity): Promise<EntityPermission[]> {
    //the fields property on the Entity always returns the fields of the current version (versionNumber=0)
    return this.entityService.getPermissions(entity.id);
  }

  @ResolveField(() => [EntityVersion])
  async versions(
    @Parent() entity: Entity,
    @Args() args: FindManyEntityVersionArgs
  ): Promise<EntityVersion[]> {
    return this.entityService.getVersions({
      ...args,
      where: {
        ...args.where,
        entity: { id: entity.id }
      }
    });
  }

  @ResolveField(() => User)
  async lockedByUser(@Parent() entity: Entity): Promise<User> {
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

  @Mutation(() => EntityPermission, { nullable: false })
  @AuthorizeContext(AuthorizableOriginParameter.EntityId, 'where.id')
  async updateEntityPermission(
    @UserEntity() user: User,
    @Args() args: UpdateEntityPermissionArgs
  ): Promise<EntityPermission> {
    return this.entityService.updateEntityPermission(args, user);
  }

  @Mutation(() => EntityPermission, { nullable: false })
  @AuthorizeContext(
    AuthorizableOriginParameter.EntityId,
    'data.entity.connect.id'
  )
  async updateEntityPermissionRoles(
    @UserEntity() user: User,
    @Args() args: UpdateEntityPermissionRolesArgs
  ): Promise<EntityPermission> {
    return this.entityService.updateEntityPermissionRoles(args, user);
  }

  @Mutation(() => EntityPermissionField, { nullable: false })
  @AuthorizeContext(
    AuthorizableOriginParameter.EntityId,
    'data.entity.connect.id'
  )
  async addEntityPermissionField(
    @UserEntity() user: User,
    @Args() args: AddEntityPermissionFieldArgs
  ): Promise<EntityPermissionField> {
    return this.entityService.addEntityPermissionField(args, user);
  }

  @Mutation(() => EntityPermissionField, { nullable: false })
  @AuthorizeContext(AuthorizableOriginParameter.EntityId, 'where.entityId')
  async deleteEntityPermissionField(
    @UserEntity() user: User,
    @Args() args: DeleteEntityPermissionFieldArgs
  ): Promise<EntityPermissionField> {
    return this.entityService.deleteEntityPermissionField(args, user);
  }

  @Mutation(() => EntityPermissionField, { nullable: false })
  @AuthorizeContext(
    AuthorizableOriginParameter.EntityPermissionFieldId,
    'data.permissionField.connect.id'
  )
  async updateEntityPermissionFieldRoles(
    @UserEntity() user: User,
    @Args() args: UpdateEntityPermissionFieldRolesArgs
  ): Promise<EntityPermissionField> {
    return this.entityService.updateEntityPermissionFieldRoles(args, user);
  }

  @Mutation(() => EntityField, { nullable: false })
  @AuthorizeContext(
    AuthorizableOriginParameter.EntityId,
    'data.entity.connect.id'
  )
  async createEntityField(
    @UserEntity() user: User,
    @Args() args: CreateOneEntityFieldArgs
  ): Promise<EntityField> {
    return this.entityService.createField(args, user);
  }

  @Mutation(() => EntityField, { nullable: false })
  @AuthorizeContext(
    AuthorizableOriginParameter.EntityId,
    'data.entity.connect.id'
  )
  async createEntityFieldByDisplayName(
    @UserEntity() user: User,
    @Args() args: CreateOneEntityFieldByDisplayNameArgs
  ): Promise<EntityField> {
    return this.entityService.createFieldByDisplayName(args, user);
  }

  @Mutation(() => EntityField, { nullable: false })
  @AuthorizeContext(AuthorizableOriginParameter.EntityFieldId, 'where.id')
  async deleteEntityField(
    @UserEntity() user: User,
    @Args() args: FindOneArgs
  ): Promise<EntityField | null> {
    return this.entityService.deleteField(args, user);
  }

  @Mutation(() => EntityField, { nullable: false })
  @AuthorizeContext(AuthorizableOriginParameter.EntityFieldId, 'where.id')
  async updateEntityField(
    @UserEntity() user: User,
    @Args() args: UpdateOneEntityFieldArgs
  ): Promise<EntityField | null> {
    return this.entityService.updateField(args, user);
  }

  @Mutation(() => EntityField, { nullable: false })
  @AuthorizeContext(AuthorizableOriginParameter.EntityFieldId, 'where.id')
  async createDefaultRelatedField(
    @UserEntity() user: User,
    @Args() args: CreateDefaultRelatedFieldArgs
  ): Promise<EntityField | null> {
    return this.entityService.createDefaultRelatedField(args, user);
  }
}
