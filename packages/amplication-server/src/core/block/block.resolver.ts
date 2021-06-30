import {
  Args,
  Mutation,
  Query,
  Resolver,
  Parent,
  ResolveField
} from '@nestjs/graphql';
import { UseFilters, UseGuards } from '@nestjs/common';

import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { BlockService } from './block.service';
import { UserService } from '../user/user.service';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import {
  CreateBlockVersionArgs,
  FindManyBlockVersionArgs,
  FindManyBlockArgs
} from './dto';
import { Block, BlockVersion, User } from 'src/models';

/** @todo add FieldResolver to return the settings, inputs, and outputs from the current version */

@Resolver(() => Block)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class BlockResolver {
  constructor(
    private readonly blockService: BlockService,
    private readonly userService: UserService
  ) {}

  @Query(() => [BlockVersion], {
    nullable: false,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.BlockId, 'where.block.id')
  async blockVersions(
    @Args() args: FindManyBlockVersionArgs
  ): Promise<BlockVersion[]> {
    return this.blockService.getVersions(args);
  }

  @Query(() => [Block], {
    nullable: false,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.app.id')
  async blocks(@Args() args: FindManyBlockArgs): Promise<Block[]> {
    return this.blockService.findMany(args);
  }

  //resolve the parentBlock property as a generic block
  @ResolveField(() => Block, { nullable: true })
  async parentBlock(@Parent() block: Block) {
    return this.blockService.getParentBlock(block);
  }

  @ResolveField(() => [User])
  async lockedByUser(@Parent() block: Block): Promise<User> {
    if (block.lockedByUserId) {
      return this.userService.findUser({
        where: {
          id: block.lockedByUserId
        }
      });
    } else {
      return null;
    }
  }
}
