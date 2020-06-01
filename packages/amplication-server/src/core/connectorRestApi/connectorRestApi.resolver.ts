import {
  Args,
  Context,
  Mutation,
  Query,
  //ResolveProperty,
  Resolver
  //Parent
} from '@nestjs/graphql';
import { UseFilters } from '@nestjs/common';

import { ConnectorRestApi } from './dto/connectorRestApi';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { ConnectorRestApiService } from './connectorRestApi.service';
import { CreateConnectorRestApiArgs } from './dto/CreateConnectorRestApiArgs';
import { FindOneWithVersionArgs } from 'src/dto';

@Resolver(() => ConnectorRestApi)
@UseFilters(GqlResolverExceptionsFilter)
export class ConnectorRestApiResolver {
  constructor(
    private readonly connectorRestApiService: ConnectorRestApiService
  ) {}

  @Query(() => ConnectorRestApi, {
    nullable: true,
    description: undefined
  })
  async ConnectorRestApi(
    @Context() ctx: any,
    @Args() args: FindOneWithVersionArgs
  ): Promise<ConnectorRestApi | null> {
    return this.connectorRestApiService.findOne(args);
  }

  @Mutation(() => ConnectorRestApi, {
    nullable: false,
    description: undefined
  })
  async createConnectorRestApi(
    @Context() ctx: any,
    @Args() args: CreateConnectorRestApiArgs
  ): Promise<ConnectorRestApi> {
    return this.connectorRestApiService.create(args);
  }
}
