import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveProperty,
  Resolver,
  Parent
} from '@nestjs/graphql';
import { UseFilters } from '@nestjs/common';

import { ConnectorRestApi } from 'src/models/blocks/connectorRestApi/connectorRestApi';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { ConnectorRestApiService } from './connectorRestApi.service';
import { CreateOneEntityArgs } from '../entity/dto/CreateOneEntityArgs';

@Resolver(_of => ConnectorRestApi)
@UseFilters(GqlResolverExceptionsFilter)
export class ConnectorRestApiResolver {
  constructor(
    private readonly connectorRestApiService: ConnectorRestApiService
  ) {}

  @Mutation(() => ConnectorRestApi, {
    nullable: false,
    description: undefined
  })
  async createConnectorRestApi(
    @Context() ctx: any,
    @Args() args: CreateOneEntityArgs
  ): Promise<ConnectorRestApi> {
    return this.connectorRestApiService.create(args);
  }
}
