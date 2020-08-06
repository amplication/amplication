import { UseGuards, UseFilters } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { GeneratedApp } from './dto/GeneratedApp';
import { CreateGeneratedAppArgs } from './dto/CreateGeneratedAppArgs';
import { GeneratedAppService } from './generatedApp.service';

@Resolver(() => GeneratedApp)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class GeneratedAppResolver {
  constructor(private readonly service: GeneratedAppService) {}
  @Mutation()
  create(@Args() args: CreateGeneratedAppArgs) {
    this.service.create(args);
  }
}
