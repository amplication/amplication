import { Resolver } from '@nestjs/graphql';
import { PluginInstallationService } from './pluginInstallation.service';
import { FindManyPluginInstallationArgs } from './dto/FindManyPluginInstallationArgs';
import { BlockTypeResolver } from '../block/blockType.resolver';
import { PluginInstallation } from './dto/PluginInstallation';
import { CreatePluginInstallationArgs } from './dto/CreatePluginInstallationArgs';
import { UpdatePluginInstallationArgs } from './dto/UpdatePluginInstallationArgs';
import { SetPluginInstallationOrder } from './dto/SetPluginInstallationOrder';
import { PluginOrder } from './dto/pluginOrder';

@Resolver(() => PluginInstallation && PluginOrder)
export class PluginInstallationResolver extends BlockTypeResolver(
  PluginInstallation,
  'PluginInstallations',
  FindManyPluginInstallationArgs,
  'createPluginInstallation',
  CreatePluginInstallationArgs,
  'updatePluginInstallation',
  UpdatePluginInstallationArgs,
  'setPluginInstallationOrder',
  SetPluginInstallationOrder
) {
  constructor(private readonly service: PluginInstallationService) {
    super();
  }
}
