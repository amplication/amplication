import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { CreateOneEntityArgs } from '../../dto/args/CreateOneEntityArgs';
import { DeleteOneEntityArgs } from "../../dto/args/DeleteOneEntityArgs";
import { FindManyEntityArgs } from "../../dto/args/FindManyEntityArgs";
//import { FindOneEntityArgs } from "./args/FindOneEntityArgs";
import { FindOneArgs } from '../../dto/args/FindOneArgs'
import { UpdateOneEntityArgs } from "../../dto/args/UpdateOneEntityArgs";
import { Entity } from "../../models/Entity";

@Resolver(_of => Entity)
export class EntityResolver {
  @Query(_returns => Entity, {
    nullable: true,
    description: undefined
  })
  async entity(@Context() ctx: any, @Args() args: FindOneArgs): Promise<Entity | null> {
    return ctx.prisma.entity.findOne(args);
  }

  @Query(_returns => [Entity], {
    nullable: false,
    description: undefined
  })
  async entities(@Context() ctx: any, @Args() args: FindManyEntityArgs): Promise<Entity[]> {
    return ctx.prisma.entity.findMany(args);
  }

  @Mutation(_returns => Entity, {
    nullable: false,
    description: undefined
  })
  async createOneEntity(@Context() ctx: any, @Args() args: CreateOneEntityArgs): Promise<Entity> {
    return ctx.prisma.entity.create(args);
  }

  @Mutation(_returns => Entity, {
    nullable: true,
    description: undefined
  })
  async deleteOneEntity(@Context() ctx: any, @Args() args: DeleteOneEntityArgs): Promise<Entity | null> {
    return ctx.prisma.entity.delete(args);
  }

  @Mutation(_returns => Entity, {
    nullable: true,
    description: undefined
  })
  async updateOneEntity(@Context() ctx: any, @Args() args: UpdateOneEntityArgs): Promise<Entity | null> {
    return ctx.prisma.entity.update(args);
  }
  
}
