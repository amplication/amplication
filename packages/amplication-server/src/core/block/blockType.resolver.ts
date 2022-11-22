import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { IBlock, User } from "../../models";
import { FindOneArgs } from "../../dto";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { BlockTypeService } from "./blockType.service";
import {
  FindManyBlockArgs,
  CreateBlockArgs,
  UpdateBlockArgs,
} from "../block/dto";
import { UserEntity } from "../../decorators/user.decorator";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { UseFilters, UseGuards } from "@nestjs/common";
import { DeleteBlockArgs } from "./dto/DeleteBlockArgs";

type Constructor<T> = {
  new (...args: any): T;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export function BlockTypeResolver<
  T extends IBlock,
  FindManyArgs extends FindManyBlockArgs,
  CreateArgs extends CreateBlockArgs,
  UpdateArgs extends UpdateBlockArgs,
  DeleteArgs extends DeleteBlockArgs
>(
  classRef: Constructor<T>,
  findManyName: string,
  findManyArgsRef: Constructor<FindManyArgs>,
  createName: string,
  createArgsRef: Constructor<CreateArgs>,
  updateName: string,
  updateArgsRef: Constructor<UpdateArgs>,
  deleteName: string,
  deleteArgsRef: Constructor<DeleteArgs>
): any {
  @Resolver({ isAbstract: true })
  @UseFilters(GqlResolverExceptionsFilter)
  @UseGuards(GqlAuthGuard)
  abstract class BaseResolverHost {
    abstract service: BlockTypeService<
      T,
      FindManyArgs,
      CreateArgs,
      UpdateArgs,
      DeleteArgs
    >;

    @Query(() => classRef, {
      name: classRef.name,
      nullable: true,
    })
    @AuthorizeContext(AuthorizableOriginParameter.BlockId, "where.id")
    async findOne(@Args() args: FindOneArgs): Promise<T | null> {
      return this.service.findOne(args);
    }

    @Query(() => [classRef], {
      name: findManyName,
      nullable: false,
    })
    @AuthorizeContext(
      AuthorizableOriginParameter.ResourceId,
      "where.resource.id"
    )
    async findMany(
      @Args({ type: () => findManyArgsRef }) args: FindManyArgs
    ): Promise<T[]> {
      return this.service.findMany(args);
    }

    @Mutation(() => classRef, {
      name: createName,
      nullable: false,
    })
    @AuthorizeContext(
      AuthorizableOriginParameter.ResourceId,
      "data.resource.connect.id"
    )
    async [createName](
      @Args({ type: () => createArgsRef }) args: CreateArgs,
      @UserEntity() user: User
    ): Promise<T> {
      return this.service.create(args, user);
    }

    @Mutation(() => classRef, {
      name: updateName,
      nullable: false,
    })
    @AuthorizeContext(AuthorizableOriginParameter.BlockId, "where.id")
    async [updateName](
      @Args({ type: () => updateArgsRef }) args: UpdateArgs,
      @UserEntity() user: User
    ): Promise<T> {
      return this.service.update(args, user);
    }

    @Mutation(() => classRef, {
      name: deleteName,
      nullable: false,
    })
    @AuthorizeContext(AuthorizableOriginParameter.BlockId, "where.id")
    async [deleteName](
      @Args({ type: () => deleteArgsRef }) args: DeleteArgs,
      @UserEntity() user: User
    ): Promise<T> {
      return this.service.delete(args, user);
    }
  }
  return BaseResolverHost;
}
