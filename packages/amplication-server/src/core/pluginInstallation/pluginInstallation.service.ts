import { Injectable } from '@nestjs/common';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { User } from '../../models';
import { BlockTypeService } from '../block/blockType.service';
import { CreatePluginInstallationArgs } from './dto/CreatePluginInstallationArgs';
import { FindManyPluginInstallationArgs } from './dto/FindManyPluginInstallationArgs';
import { PluginInstallation } from './dto/PluginInstallation';
import { UpdatePluginInstallationArgs } from './dto/UpdatePluginInstallationArgs';
import { BlockService } from '../block/block.service';

@Injectable()
export class PluginInstallationService extends BlockTypeService<
  PluginInstallation,
  FindManyPluginInstallationArgs,
  CreatePluginInstallationArgs,
  UpdatePluginInstallationArgs
> {
  blockType = EnumBlockType.PluginInstallation;

  constructor(protected readonly blockService: BlockService) {
    super(blockService);
  }

  async create(
    args: CreatePluginInstallationArgs,
    user: User
  ): Promise<PluginInstallation> {
    const installations = await super.findMany({
      where: {
        resource: {
          id: args.data.resource.connect.id
        }
      }
    });

    installations.sort(plugin => plugin.order);

    args.data.order = installations.length
      ? installations[installations.length - 1].order + 1
      : 1;

    return super.create(args, user);
  }

  async update(
    args: UpdatePluginInstallationArgs,
    user: User
  ): Promise<PluginInstallation> {
    const installation = await super.findOne({
      where: {
        id: args.where.id
      }
    });

    args.data.pluginId = installation.pluginId;
    args.data.order = installation.order;

    return super.update(args, user);
  }
}
