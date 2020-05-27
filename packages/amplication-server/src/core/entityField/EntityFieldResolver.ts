import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveProperty,
  Resolver,
  Root
} from '@nestjs/graphql';
import { CreateOneEntityFieldArgs, UpdateOneEntityFieldArgs } from './dto';
import { FindOneArgs } from '../../dto';
import { EntityFieldService } from '../../core';
import { EntityField } from '../../models';
import { GqlResolverExceptionsFilter } from '../../filters/GqlResolverExceptions.filter';
import { UseGuards, UseFilters } from '@nestjs/common';

@Resolver(_of => EntityField)
@UseFilters(GqlResolverExceptionsFilter)
export class EntityFieldResolver {
  constructor(private readonly entityFieldService: EntityFieldService) {}
  @Query(_returns => EntityField, {
    nullable: true,
    description: undefined
  })
  async entityField(
    @Context() ctx: any,
    @Args() args: FindOneArgs
  ): Promise<EntityField | null> {
    return this.entityFieldService.entityField(args);
  }

  // @Query(_returns => [EntityField], {
  //   nullable: false,
  //   description: undefined
  // })
  // async entityFields(@Context() ctx: any, @Args() args: FindManyEntityFieldArgs): Promise<EntityField[]> {
  //   return ctx.prisma.entityField.findMany(args);
  // }

  @Mutation(_returns => EntityField, {
    nullable: true,
    description: undefined
  })
  async createEntityField(
    @Context() ctx: any,
    @Args() args: CreateOneEntityFieldArgs
  ): Promise<EntityField> {
    return this.entityFieldService.createEntityField(args);
  }

  @Mutation(_returns => EntityField, {
    nullable: true,
    description: undefined
  })
  async deleteEntityField(
    @Context() ctx: any,
    @Args() args: FindOneArgs
  ): Promise<EntityField | null> {
    return ctx.prisma.entityField.delete(args);
  }

  @Mutation(_returns => EntityField, {
    nullable: true,
    description: undefined
  })
  async updateEntityField(
    @Context() ctx: any,
    @Args() args: UpdateOneEntityFieldArgs
  ): Promise<EntityField | null> {
    return this.entityFieldService.updateEntityField(args);
  }
}
