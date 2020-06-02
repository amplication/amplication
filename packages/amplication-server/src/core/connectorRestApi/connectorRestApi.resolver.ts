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

import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { ConnectorRestApiService } from './connectorRestApi.service';
import {
  ConnectorRestApi,
  CreateConnectorRestApiArgs,
  FindManyConnectorRestApiArgs
} from './dto/';
import { FindOneWithVersionArgs } from 'src/dto';

//todo: add FieldResolver to return the settings, inputs, and outputs from the current version

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

  @Query(() => [ConnectorRestApi], {
    nullable: false,
    description: undefined
  })
  async connectorRestApis(
    @Context() ctx: any,
    @Args() args: FindManyConnectorRestApiArgs
  ): Promise<ConnectorRestApi[]> {
    return this.connectorRestApiService.findMany(args);
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
