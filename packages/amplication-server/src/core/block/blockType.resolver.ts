import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
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
import { Inject, UseFilters, UseGuards } from "@nestjs/common";
import { DeleteBlockArgs } from "./dto/DeleteBlockArgs";
import { UserService } from "../user/user.service";
import { camelCase } from "camel-case";

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
  @Resolver(() => IBlock, { isAbstract: true })
  @UseFilters(GqlResolverExceptionsFilter)
  @UseGuards(GqlAuthGuard)
  abstract class BaseResolverHost {
    @Inject(UserService)
    private readonly userService: UserService;

    abstract service: BlockTypeService<
      T,
      FindManyArgs,
      CreateArgs,
      UpdateArgs,
      DeleteArgs
    >;

    @Query(() => classRef, {
      name: camelCase(classRef.name),
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
      @Args({ type: () => findManyArgsRef }) args: FindManyArgs,
      @UserEntity() user: User
    ): Promise<T[]> {
      return this.service.findMany(args, user);
    }

    @Mutation(() => classRef, {
      name: createName,
      nullable: false,
    })
    @AuthorizeContext(
      AuthorizableOriginParameter.ResourceId,
      "data.resource.connect.id",
      "resource.*.edit"
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
    @AuthorizeContext(
      AuthorizableOriginParameter.BlockId,
      "where.id",
      "resource.*.edit"
    )
    async [updateName](
      @Args({ type: () => updateArgsRef }) args: UpdateArgs,
      @UserEntity() user: User
    ): Promise<T> {
      return this.service.update(args, user, []);
    }

    @ResolveField(() => User, { nullable: true })
    async lockedByUser(@Parent() block: T): Promise<User> {
      if (block.lockedByUserId) {
        return this.userService.findUser({
          where: {
            id: block.lockedByUserId,
          },
        });
      } else {
        return null;
      }
    }

    @Mutation(() => classRef, {
      name: deleteName,
      nullable: false,
    })
    @AuthorizeContext(
      AuthorizableOriginParameter.BlockId,
      "where.id",
      "resource.*.edit"
    )
    async [deleteName](
      @Args({ type: () => deleteArgsRef }) args: DeleteArgs,
      @UserEntity() user: User
    ): Promise<T> {
      return this.service.delete(args, user, true);
    }
  }
  return BaseResolverHost;
}
