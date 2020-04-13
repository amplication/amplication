import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { CreateOneEntityVersionArgs } from "../dto/args/CreateOneEntityVersionArgs";
// import { DeleteOneEntityVersionArgs } from "./args/DeleteOneEntityVersionArgs";
import { FindManyEntityVersionArgs } from "../dto/args/FindManyEntityVersionArgs";
// import { FindOneEntityVersionArgs } from "./args/FindOneEntityVersionArgs";
// import { UpdateOneEntityVersionArgs } from "./args/UpdateOneEntityVersionArgs";
import { EntityVersionService} from '../core/entityVersion/entityVersion.service'
import { EntityVersion } from "../models";

@Resolver(_of => EntityVersion)
export class EntityVersionResolver {
  constructor(readonly EntityVersionService:EntityVersionService) {}
  // @Query(_returns => EntityVersion, {
  //   nullable: true,
  //   description: undefined
  // })
  // async entityVersion(@Context() ctx: any, @Args() args: FindOneEntityVersionArgs): Promise<EntityVersion | null> {
  //   return ctx.prisma.entityVersion.findOne(args);
  // }

  @Query(_returns => [EntityVersion], {
    nullable: false,
    description: undefined
  })
  async entityVersions(@Context() ctx: any, @Args() args: FindManyEntityVersionArgs): Promise<EntityVersion[]> {
    return ctx.prisma.entityVersion.findMany(args);
  }

  @Mutation(_returns => EntityVersion, {
    nullable: false,
    description: undefined
  })
  async createOneEntityVersion(@Context() ctx: any, @Args() args: CreateOneEntityVersionArgs): Promise<EntityVersion> {
    return this.EntityVersionService.createOneEntityVersion(args);
  }

  // @Mutation(_returns => EntityVersion, {
  //   nullable: true,
  //   description: undefined
  // })
  // async deleteOneEntityVersion(@Context() ctx: any, @Args() args: DeleteOneEntityVersionArgs): Promise<EntityVersion | null> {
  //   return ctx.prisma.entityVersion.delete(args);
  // }

  // @Mutation(_returns => EntityVersion, {
  //   nullable: true,
  //   description: undefined
  // })
  // async updateOneEntityVersion(@Context() ctx: any, @Args() args: UpdateOneEntityVersionArgs): Promise<EntityVersion | null> {
  //   return ctx.prisma.entityVersion.update(args);
  // }

}
