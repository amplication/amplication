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
import {
  ConnectorRestApiCall,
  CreateConnectorRestApiCallArgs,
  FindManyConnectorRestApiCallArgs
} from './dto/';
import { Block } from 'src/models';
import { FindOneWithVersionArgs } from 'src/dto';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { BlockService } from '../block/block.service';

//** @todo add FieldResolver to return the settings, inputs, and outputs from the current version */

@Resolver(() => ConnectorRestApiCall)
@UseGuards(GqlAuthGuard)
@UseFilters(GqlResolverExceptionsFilter)
export class ConnectorRestApiCallResolver {
  constructor(
    private readonly ConnectorRestApiCallService: ConnectorRestApiCallService,
    private readonly blockService: BlockService
  ) {}

  @Query(() => ConnectorRestApiCall, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.BlockId, 'where.id')
  async ConnectorRestApiCall(
    @Args() args: FindOneWithVersionArgs
  ): Promise<ConnectorRestApiCall | null> {
    return this.ConnectorRestApiCallService.findOne(args);
  }

  @Query(() => [ConnectorRestApiCall], {
    nullable: false,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.app.id')
  async ConnectorRestApiCalls(
    @Args() args: FindManyConnectorRestApiCallArgs
  ): Promise<ConnectorRestApiCall[]> {
    return this.ConnectorRestApiCallService.findMany(args);
  }

  @Mutation(() => ConnectorRestApiCall, {
    nullable: false,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'data.app.connect.id')
  async createConnectorRestApiCall(
    @Args() args: CreateConnectorRestApiCallArgs
  ): Promise<ConnectorRestApiCall> {
    return this.ConnectorRestApiCallService.create(args);
  }

  //resolve the parentBlock property as a generic block
  @ResolveProperty('parentBlock', () => Block, { nullable: true })
  async parentBlock(@Parent() block: ConnectorRestApiCall) {
    return this.blockService.getParentBlock(block);
  }
}
