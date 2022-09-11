import { Injectable } from '@nestjs/common';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { User } from '../../models';
import { BlockTypeService } from '../block/blockType.service';
import { CreatePluginInstallationArgs } from './dto/CreatePluginInstallationArgs';
import { FindManyPluginInstallationArgs } from './dto/FindManyPluginInstallationArgs';
import { PluginInstallation } from './dto/PluginInstallation';
import { UpdatePluginInstallationArgs } from './dto/UpdatePluginInstallationArgs';
import { BlockService } from '../block/block.service';
import { PluginOrderService } from './pluginOrder.service';
import { PluginOrder } from './dto/PluginOrder';
import { SetPluginOrderArgs } from './dto/SetPluginOrderArgs';

@Injectable()
export class PluginInstallationService extends BlockTypeService<
  PluginInstallation,
  FindManyPluginInstallationArgs,
  CreatePluginInstallationArgs,
  UpdatePluginInstallationArgs
> {
  blockType = EnumBlockType.PluginInstallation;

  constructor(
    protected readonly blockService: BlockService,
    protected readonly pluginOrderService: PluginOrderService
  ) {
    super(blockService);
  }

  async create(
    args: CreatePluginInstallationArgs,
    user: User
  ): Promise<PluginInstallation> {
    const newPlugin = await super.create(args, user);

    await this.setOrder(
      {
        data: {
          order: -1
        },
        where: {
          id: newPlugin.id
        }
      },
      user
    );

    return newPlugin;
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

    return super.update(args, user);
  }

  async setOrder(args: SetPluginOrderArgs, user: User): Promise<PluginOrder> {
    const installation = await super.findOne({
      where: {
        id: args.where.id
      }
    });

    const [currentOrder] = await this.pluginOrderService.findMany({
      where: {
        resource: {
          id: installation.resourceId
        }
      }
    });

    if (!currentOrder) {
      return await this.pluginOrderService.create(
        {
          data: {
            displayName: 'Plugin Order',
            order: [
              {
                pluginId: installation.pluginId,
                order: 1
              }
            ],
            resource: {
              connect: {
                id: installation.resourceId
              }
            }
          }
        },
        user
      );
    }

    let newOrder = [];

    if (args.data.order === -1) {
      newOrder = [
        ...currentOrder.order,
        {
          pluginId: installation.pluginId,
          order: currentOrder.order.length + 1
        }
      ];
    } else {
      //todo: manipulate currentOrder.order
      newOrder = [...currentOrder.order];
    }

    return this.pluginOrderService.update(
      {
        data: {
          order: newOrder
        },
        where: {
          id: currentOrder.id
        }
      },
      user
    );
  }
}
