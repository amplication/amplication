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
import { ConnectorRestApiCallService } from './connectorRestApiCall.service';
import { BlockService } from '../block/block.service';

//** @todo add FieldResolver to return the settings, inputs, and outputs from the current version */

@Resolver(() => ConnectorRestApiCall)
@UseGuards(GqlAuthGuard)
@UseFilters(GqlResolverExceptionsFilter)
export class ConnectorRestApiCallResolver {
  constructor(
    private readonly connectorRestApiCallService: ConnectorRestApiCallService,
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
    return this.connectorRestApiCallService.findOne(args);
  }

  @Query(() => [ConnectorRestApiCall], {
    nullable: false,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.app.id')
  async ConnectorRestApiCalls(
    @Args() args: FindManyConnectorRestApiCallArgs
  ): Promise<ConnectorRestApiCall[]> {
    return this.connectorRestApiCallService.findMany(args);
  }

  @Mutation(() => ConnectorRestApiCall, {
    nullable: false,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'data.app.connect.id')
  async createConnectorRestApiCall(
    @Args() args: CreateConnectorRestApiCallArgs
  ): Promise<ConnectorRestApiCall> {
    return this.connectorRestApiCallService.create(args);
  }

  //resolve the parentBlock property as a generic block
  @ResolveField(() => Block, { nullable: true })
  async parentBlock(@Parent() block: ConnectorRestApiCall) {
    return this.blockService.getParentBlock(block);
  }
}
