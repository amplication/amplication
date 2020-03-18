import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root,Parent } from "@nestjs/graphql";
import { CreateOneEntityArgs ,FindManyEntityArgs,FindOneArgs  } from '../dto/args';
import { UpdateOneEntityArgs } from "../dto/args";
import { Entity, EntityField, EntityVersion } from "../models";
import { EntityService } from '../core/entity/Entity.Service';

@Resolver(_of => Entity)
export class EntityResolver {
  constructor(private readonly entityService: EntityService) {}
  @Query(_returns => Entity, {
    nullable: true,
    description: undefined
  })
  async entity(@Context() ctx: any, @Args() args: FindOneArgs): Promise<Entity | null> {
    console.log("EntityResolver"); 
    return this.entityService.entity(args);
  }

  @Query(_returns => [Entity], {
    nullable: false,
    description: undefined
  })
  async entities(@Context() ctx: any, @Args() args: FindManyEntityArgs): Promise<Entity[]> {
    return this.entityService.entities(args);
  }

  @Mutation(_returns => Entity, {
    nullable: false,
    description: undefined
  })
  async createOneEntity(@Context() ctx: any, @Args() args: CreateOneEntityArgs): Promise<Entity> {
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
  async updateOneEntity(@Context() ctx: any, @Args() args: UpdateOneEntityArgs): Promise<Entity | null> {
    return this.entityService.updateOneEntity(args);
  }
  

  @ResolveProperty('entityFields', returns => [EntityField])
  async entityFields(@Parent() entity: Entity ) {
    return this.entityService.getEntityFields(entity);
  }
  
}
