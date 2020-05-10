import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveProperty,
  Resolver,
  Root,
  Parent,
  Info
} from '@nestjs/graphql';
import { CreateOneEntityArgs } from '../dto/args/CreateOneEntityArgs';
//import { DeleteOneEntityArgs } from "../../dto/args/DeleteOneEntityArgs";
import { FindManyEntityArgs } from '../dto/args/FindManyEntityArgs';
//import { FindOneEntityArgs } from "./args/FindOneEntityArgs";
import { FindOneEntityArgs } from '../dto/args/FindOneEntityArgs';
import { UpdateOneEntityArgs } from '../dto/args/UpdateOneEntityArgs';
import { Entity, EntityField, EntityVersion } from '../models';
import { EntityService } from '../core/entity/Entity.Service';
import { GqlResolverExceptionsFilter } from '../filters/GqlResolverExceptions.filter';
import { UseGuards, UseFilters } from '@nestjs/common';

@Resolver(_of => Entity)
@UseFilters(GqlResolverExceptionsFilter)
export class EntityResolver {
  constructor(private readonly entityService: EntityService) {}
  @Query(_returns => Entity, {
    nullable: true,
    description: undefined
  })
  async entity(
    @Context() ctx: any,
    @Args() args: FindOneEntityArgs
  ): Promise<Entity | null> {
    console.log('EntityResolver');
    return this.entityService.entity(args);
  }

  @Query(_returns => [Entity], {
    nullable: false,
    description: undefined
  })
  async entities(
    @Context() ctx: any,
    @Args() args: FindManyEntityArgs
  ): Promise<Entity[]> {
    return this.entityService.entities(args);
  }

  @Mutation(_returns => Entity, {
    nullable: false,
    description: undefined
  })
  async createOneEntity(
    @Context() ctx: any,
    @Args() args: CreateOneEntityArgs
  ): Promise<Entity> {
    return this.entityService.createOneEntity(args);
  }

  // @Mutation(_returns => Entity, {
  //   nullable: true,
  //   description: undefined
  // })
  // async deleteOneEntity(@Context() ctx: any, @Args() args: DeleteOneEntityArgs): Promise<Entity | null> {
  //   return ctx.prisma.entity.delete(args);
  // }

  @Mutation(_returns => Entity, {
    nullable: true,
    description: undefined
  })
  async updateOneEntity(
    @Context() ctx: any,
    @Args() args: UpdateOneEntityArgs
  ): Promise<Entity | null> {
    return this.entityService.updateOneEntity(args);
  }

  @ResolveProperty('entityFields', returns => [EntityField])
  async entityFields(@Parent() entity: Entity) {
    console.log("@ResolveProperty('entityFields'");
    if (entity.entityFields && entity.entityFields.length) {
      return entity.entityFields;
    }
    return this.entityService.getEntityFields(entity);
  }
}
//, @Context() context: any,
//@Info() info :any,
//,  @Args() args: string

// getVesrionsList
// rollbacktoVersion
// currant version is always 0
