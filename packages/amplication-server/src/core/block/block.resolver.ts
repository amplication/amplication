import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { FindOneArgs } from "../../dto";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { Block, BlockVersion, User } from "../../models";
import { UserService } from "../user/user.service";
import { BlockService } from "./block.service";
import { FindManyBlockArgs, FindManyBlockVersionArgs } from "./dto";

/** @todo add FieldResolver to return the settings, inputs, and outputs from the current version */

@Resolver(() => Block)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class BlockResolver {
  constructor(
    private readonly blockService: BlockService,
    private readonly userService: UserService
  ) {}

  @Query(() => [Block], {
    nullable: false,
  })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.resource.id")
  async blocks(@Args() args: FindManyBlockArgs): Promise<Block[]> {
    return this.blockService.findMany(args);
  }

  @Query(() => Block, {
    nullable: false,
  })
  @AuthorizeContext(AuthorizableOriginParameter.BlockId, "where.id")
  async block(@Args() args: FindOneArgs): Promise<Block> {
    return this.blockService.block(args);
  }

  //resolve the parentBlock property as a generic block
  @ResolveField(() => Block, { nullable: true })
  async parentBlock(@Parent() block: Block): Promise<Block> {
    return this.blockService.getParentBlock(block);
  }

  @ResolveField(() => [BlockVersion])
  async versions(
    @Parent() entity: Block,
    @Args() args: FindManyBlockVersionArgs
  ): Promise<BlockVersion[]> {
    return this.blockService.getVersions({
      ...args,
      where: {
        ...args.where,
        block: { id: entity.id },
      },
    });
  }

  @ResolveField(() => [User])
  async lockedByUser(@Parent() block: Block): Promise<User> {
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
}
