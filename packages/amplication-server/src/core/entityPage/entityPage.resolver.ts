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
import { EntityPageService } from './entityPage.service';
import {
  EntityPage,
  CreateEntityPageArgs,
  FindManyEntityPageArgs
} from './dto/';
import { Block } from 'src/models';
import { FindOneWithVersionArgs } from 'src/dto';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { BlockService } from '../block/block.service';

//** @todo add FieldResolver to return the settings, inputs, and outputs from the current version */

@Resolver(() => EntityPage)
@UseGuards(GqlAuthGuard)
@UseFilters(GqlResolverExceptionsFilter)
export class EntityPageResolver {
  constructor(
    private readonly entityPageService: EntityPageService,
    private readonly blockService: BlockService
  ) {}

  @Query(() => EntityPage, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.BlockId, 'where.id')
  async EntityPage(
    @Args() args: FindOneWithVersionArgs
  ): Promise<EntityPage | null> {
    return this.entityPageService.findOne(args);
  }

  @Query(() => [EntityPage], {
    nullable: false,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.app.id')
  async EntityPages(
    @Args() args: FindManyEntityPageArgs
  ): Promise<EntityPage[]> {
    return this.entityPageService.findMany(args);
  }

  @Mutation(() => EntityPage, {
    nullable: false,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'data.app.connect.id')
  async createEntityPage(
    @Args() args: CreateEntityPageArgs
  ): Promise<EntityPage> {
    return this.entityPageService.create(args);
  }

  //resolve the parentBlock property as a generic block
  @ResolveField(() => Block, { nullable: true })
  async parentBlock(@Parent() block: EntityPage) {
    return this.blockService.getParentBlock(block);
  }
}
