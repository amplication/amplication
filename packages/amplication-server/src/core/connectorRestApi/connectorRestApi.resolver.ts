import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseFilters, UseGuards } from '@nestjs/common';

import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { ConnectorRestApiService } from './connectorRestApi.service';
import {
  ConnectorRestApi,
  CreateConnectorRestApiArgs,
  FindManyConnectorRestApiArgs
} from './dto/';
import { FindOneWithVersionArgs } from 'src/dto';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';

//** @todo add FieldResolver to return the settings, inputs, and outputs from the current version */

@Resolver(() => ConnectorRestApi)
@UseGuards(GqlAuthGuard)
@UseFilters(GqlResolverExceptionsFilter)
export class ConnectorRestApiResolver {
  constructor(
    private readonly connectorRestApiService: ConnectorRestApiService
  ) {}

  @Query(() => ConnectorRestApi, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.BlockId, 'where.id')
  async ConnectorRestApi(
    @Args() args: FindOneWithVersionArgs
  ): Promise<ConnectorRestApi | null> {
    return this.connectorRestApiService.findOne(args);
  }

  @Query(() => [ConnectorRestApi], {
    nullable: false,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.app.id')
  async connectorRestApis(
    @Args() args: FindManyConnectorRestApiArgs
  ): Promise<ConnectorRestApi[]> {
    return this.connectorRestApiService.findMany(args);
  }

  @Mutation(() => ConnectorRestApi, {
    nullable: false,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'data.app.connect.id')
  async createConnectorRestApi(
    @Args() args: CreateConnectorRestApiArgs
  ): Promise<ConnectorRestApi> {
    return this.connectorRestApiService.create(args);
  }
}
