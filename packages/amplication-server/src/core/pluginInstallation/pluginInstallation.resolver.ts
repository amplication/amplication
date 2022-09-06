import { Resolver } from '@nestjs/graphql';
import { PluginInstallationService } from './pluginInstallation.service';
import { FindManyPluginInstallationArgs } from './dto/FindManyPluginInstallationArgs';
import { BlockTypeResolver } from '../block/blockType.resolver';
import { PluginInstallation } from './dto/PluginInstallation';
import { CreatePluginInstallationArgs } from './dto/CreatePluginInstallationArgs';
import { UpdatePluginInstallationArgs } from './dto/UpdatePluginInstallationArgs';
import { GqlResolverExceptionsFilter } from '../../filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { UseFilters, UseGuards } from '@nestjs/common';

@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
@Resolver(() => PluginInstallation)
export class PluginInstallationResolver extends BlockTypeResolver(
  PluginInstallation,
  'PluginInstallations',
  FindManyPluginInstallationArgs,
  'createPluginInstallation',
  CreatePluginInstallationArgs,
  'updatePluginInstallation',
  UpdatePluginInstallationArgs
) {
  constructor(private readonly service: PluginInstallationService) {
    super();
  }
}
