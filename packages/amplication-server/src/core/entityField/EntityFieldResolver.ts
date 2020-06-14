import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateOneEntityFieldArgs, UpdateOneEntityFieldArgs } from './dto';
import { FindOneArgs } from 'src/dto';
import { EntityFieldService } from './entityField.service';
import { EntityField } from 'src/models';
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

  // @Query(() => [EntityField], {
  //   nullable: false,
  //   description: undefined
  // })
  // async entityFields(@Context() ctx: any, @Args() args: FindManyEntityFieldArgs): Promise<EntityField[]> {
  //   return ctx.prisma.entityField.findMany(args);
  // }

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
}
