import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { CreateOneProjectArgs } from '../../dto/args';
//import { DeleteManyProjectArgs } from "./../../../prisma/dal/resolvers/crud/Project/args/DeleteManyProjectArgs";
//import { DeleteOneProjectArgs } from "./../../../prisma/dal/resolvers/crud/Project/args/DeleteOneProjectArgs";
import { FindManyProjectArgs } from '../../dto/args';
import { FindOneProjectArgs } from "../../dto/args";
//import { UpdateManyProjectArgs } from "./../../../prisma/dal/resolvers/crud/Project/args/UpdateManyProjectArgs";
//import { UpdateOneProjectArgs } from "../../../prisma/dal/resolvers/crud/Project/args/UpdateOneProjectArgs";
//import { UpsertOneProjectArgs } from "./../../../prisma/dal/resolvers/crud/Project/args/UpsertOneProjectArgs";
import { Project } from '../../models';
//import { BatchPayload } from '../../../prisma/dal/outputs/BatchPayload';
import { ProjectService} from '../../core/project';
//import { PrismaService} from '../../services/prisma.service'


@Resolver(_of => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}
  // @Query(_returns => Project, {
  //   nullable: true,
  //   description: undefined
  // })
  // async project(@Context() ctx: any, @Args() args: FindOneProjectArgs): Promise<Project | null> {
  //   return ctx.prisma.project.findOne(args);
  // }

  // @Query(_returns => [Project], {
  //   nullable: false,
  //   description: undefined
  // })
  // async projects(@Context() ctx: any, @Args() args: FindManyProjectArgs): Promise<Project[]> {
  //   return ctx.prisma.project.findMany(args);
  // }

  @Mutation(_returns => Project, {
    nullable: false,
    description: undefined
  })
  async createOneProject(@Context() ctx: any, @Args() args: CreateOneProjectArgs): Promise<Project> {
    
    return this.projectService.createOneProject(args);
    //return ctx.prisma.project.create(args);
  }

  // @Mutation(_returns => Project, {
  //   nullable: true,
  //   description: undefined
  // })
  // async deleteOneProject(@Context() ctx: any, @Args() args: DeleteOneProjectArgs): Promise<Project | null> {
  //   return ctx.prisma.project.delete(args);
  // }

  // @Mutation(_returns => Project, {
  //   nullable: true,
  //   description: undefined
  // })
  // async updateOneProject(@Context() ctx: any, @Args() args: UpdateOneProjectArgs): Promise<Project | null> {
  //   return ctx.prisma.project.update(args);
  // }

  // @Mutation(_returns => BatchPayload, {
  //   nullable: false,
  //   description: undefined
  // })
  // async deleteManyProject(@Context() ctx: any, @Args() args: DeleteManyProjectArgs): Promise<BatchPayload> {
  //   return ctx.prisma.project.deleteMany(args);
  // }

  // @Mutation(_returns => BatchPayload, {
  //   nullable: false,
  //   description: undefined
  // })
  // async updateManyProject(@Context() ctx: any, @Args() args: UpdateManyProjectArgs): Promise<BatchPayload> {
  //   return ctx.prisma.project.updateMany(args);
  // }

  // @Mutation(_returns => Project, {
  //   nullable: false,
  //   description: undefined
  // })
  // async upsertOneProject(@Context() ctx: any, @Args() args: UpsertOneProjectArgs): Promise<Project> {
  //   return ctx.prisma.project.upsert(args);
  // }
}
