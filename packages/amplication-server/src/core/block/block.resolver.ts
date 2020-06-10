import {
  Args,
  Mutation,
  Query,
  ResolveProperty,
  Resolver,
  Parent
} from '@nestjs/graphql';
import { UseFilters, UseGuards } from '@nestjs/common';

import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { BlockService } from './block.service';

import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import {
  CreateBlockVersionArgs,
  FindManyBlockVersionArgs,
  FindManyBlockArgs
} from './dto';
import { Block, BlockVersion } from 'src/models';

//** @todo add FieldResolver to return the settings, inputs, and outputs from the current version */

@Resolver(() => Block)
@UseGuards(GqlAuthGuard)
@UseFilters(GqlResolverExceptionsFilter)
export class BlockResolver {
  constructor(private readonly blockService: BlockService) {}

  @Mutation(() => Block, {
    nullable: false,
    description: undefined
  })
  @AuthorizeContext(
    AuthorizableResourceParameter.BlockId,
    'data.block.connect.id'
  )
  async createBlockVersion(
    @Args() args: CreateBlockVersionArgs
  ): Promise<Block<any>> {
    return this.blockService.createVersion(args);
  }

  @Query(() => [BlockVersion], {
    nullable: false,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.BlockId, 'where.block.id')
  async blockVersions(
    @Args() args: FindManyBlockVersionArgs
  ): Promise<BlockVersion<any>[]> {
    return this.blockService.getVersions(args);
  }

  @Query(() => [Block], {
    nullable: false,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.app.id')
  async blocks(@Args() args: FindManyBlockArgs): Promise<Block<any>[]> {
    return this.blockService.findMany(args);
  }

  //resolve the parentBlock property as a generic block
  @ResolveProperty('parentBlock', () => Block, { nullable: true })
  async entityFields(@Parent() block: Block<any>) {
    return this.blockService.getParentBlock(block);
  }
}
