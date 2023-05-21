import { Injectable } from "@nestjs/common";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { User } from "../../models";
import { BlockTypeService } from "../block/blockType.service";
import { CreatePluginInstallationArgs } from "./dto/CreatePluginInstallationArgs";
import { FindManyPluginInstallationArgs } from "./dto/FindManyPluginInstallationArgs";
import { PluginInstallation } from "./dto/PluginInstallation";
import { UpdatePluginInstallationArgs } from "./dto/UpdatePluginInstallationArgs";
import { BlockService } from "../block/block.service";
import { PluginOrderService } from "./pluginOrder.service";
import { PluginOrder } from "./dto/PluginOrder";
import { SetPluginOrderArgs } from "./dto/SetPluginOrderArgs";
import { PluginOrderItem } from "./dto/PluginOrderItem";
import { DeletePluginOrderArgs } from "./dto/DeletePluginOrderArgs";
import { CreatePluginInstallationsArgs } from "./dto/CreatePluginInstallationsArgs";

const reOrderPlugins = (
  argsData: PluginOrderItem,
  pluginArr: PluginOrderItem[]
) => {
  const currId = argsData.pluginId;
  const currOrder = argsData.order;
  let orderIndex = 1;
  const sortHelperMap = { [currOrder]: currId };
  const newOrderArr = [{ pluginId: currId, order: currOrder }];

  pluginArr.reduce(
    (orderedObj: { [key: string]: string }, plugin: PluginOrderItem) => {
      if (currId === plugin.pluginId) return orderedObj;

      orderIndex = orderedObj.hasOwnProperty(orderIndex)
        ? orderIndex + 1
        : orderIndex;

      orderedObj[orderIndex] = plugin.pluginId;
      newOrderArr.push({ pluginId: plugin.pluginId, order: orderIndex });
      orderIndex++;

      return orderedObj;
    },
    sortHelperMap
  );

  return newOrderArr;
};

const sortPluginsArr = (pluginArr: PluginOrderItem[]) =>
  pluginArr.sort((a, b) => (a.order > b.order ? 1 : -1));

@Injectable()
export class PluginInstallationService extends BlockTypeService<
  PluginInstallation,
  FindManyPluginInstallationArgs,
  CreatePluginInstallationArgs,
  UpdatePluginInstallationArgs,
  DeletePluginOrderArgs
> {
  blockType = EnumBlockType.PluginInstallation;

  constructor(
    protected readonly blockService: BlockService,
    protected readonly pluginOrderService: PluginOrderService
  ) {
    super(blockService);
  }

  async createMany(
    args: CreatePluginInstallationsArgs,
    user: User
  ): Promise<PluginInstallation[]> {
    const { plugins } = args.data;

    const newPlugins: PluginInstallation[] = [];

    for (let index = 0; index < plugins.length; index++) {
      const currentArgs: CreatePluginInstallationArgs = {
        data: plugins[index],
      };
      const newPlugin = await super.create(currentArgs, user);
      newPlugins.push(newPlugin);

      await this.setOrder(
        {
          data: {
            order: -1,
          },
          where: {
            id: newPlugin.id,
          },
        },
        user
      );
    }

    return newPlugins;
  }

  async create(
    args: CreatePluginInstallationArgs,
    user: User
  ): Promise<PluginInstallation> {
    const newPlugin = await super.create(args, user);
    await this.setOrder(
      {
        data: {
          order: -1,
        },
        where: {
          id: newPlugin.id,
        },
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
        id: args.where.id,
      },
    });

    args.data.pluginId = installation.pluginId;
    args.data.npm = installation.npm;

    return super.update(args, user);
  }

  async setOrder(args: SetPluginOrderArgs, user: User): Promise<PluginOrder> {
    const installation = await super.findOne({
      where: {
        id: args.where.id,
      },
    });

    const [currentOrder] = await this.pluginOrderService.findMany({
      where: {
        resource: {
          id: installation.resourceId,
        },
      },
    });

    if (!currentOrder) {
      return await this.pluginOrderService.create(
        {
          data: {
            displayName: "Plugin Order",
            order: [
              {
                pluginId: installation.pluginId,
                order: 1,
              },
            ],
            resource: {
              connect: {
                id: installation.resourceId,
              },
            },
          },
        },
        user
      );
    }

    const orderedPluginArr = sortPluginsArr(currentOrder.order);
    const newOrderedPlugins = reOrderPlugins(
      {
        pluginId: installation.pluginId,
        order:
          args.data.order === -1
            ? currentOrder.order.length + 1
            : args.data.order,
      },
      orderedPluginArr
    );

    return this.pluginOrderService.update(
      {
        data: {
          order: sortPluginsArr(newOrderedPlugins),
        },
        where: {
          id: currentOrder.id,
        },
      },
      user
    );
  }
}
