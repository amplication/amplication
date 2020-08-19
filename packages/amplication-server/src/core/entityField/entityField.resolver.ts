import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent
} from '@nestjs/graphql';
import {
  CreateOneEntityFieldArgs,
  UpdateOneEntityFieldArgs,
  UpdateEntityFieldPermissionsArgs
} from './dto';
import { FindOneArgs } from 'src/dto';
import { EntityFieldService } from './entityField.service';
import { EntityField, EntityFieldPermission, User } from 'src/models';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { UseFilters } from '@nestjs/common';

@Resolver(() => EntityField)
@UseFilters(GqlResolverExceptionsFilter)
export class EntityFieldResolver {
  constructor(private readonly entityFieldService: EntityFieldService) {}
  @Query(() => EntityField, {
    nullable: true,
    description: undefined
  })
  async entityField(
    @Context() ctx: any,
    @Args() args: FindOneArgs
  ): Promise<EntityField | null> {
    return this.entityFieldService.entityField(args);
  }

  @Mutation(() => EntityField, {
    nullable: true,
    description: undefined
  })
  async createEntityField(
    @Context() ctx: any,
    @Args() args: CreateOneEntityFieldArgs
  ): Promise<EntityField> {
    return this.entityFieldService.createEntityField(args);
  }

  @Mutation(() => EntityField, {
    nullable: true,
    description: undefined
  })
  async deleteEntityField(
    @Context() ctx: any,
    @Args() args: FindOneArgs
  ): Promise<EntityField | null> {
    return ctx.prisma.entityField.delete(args);
  }

  @Mutation(() => EntityField, {
    nullable: true,
    description: undefined
  })
  async updateEntityField(
    @Context() ctx: any,
    @Args() args: UpdateOneEntityFieldArgs
  ): Promise<EntityField | null> {
    return this.entityFieldService.updateEntityField(args);
  }

  @ResolveField(() => [EntityFieldPermission])
  async permissions(@Parent() entityField: EntityField) {
    return this.entityFieldService.getPermissions(entityField.id);
  }

  @Mutation(() => [EntityFieldPermission], {
    nullable: true,
    description: undefined
  })
  async updateEntityFieldPermissions(
    @Args() args: UpdateEntityFieldPermissionsArgs
  ): Promise<EntityFieldPermission[] | null> {
    return this.entityFieldService.updatePermissions(args);
  }
}
