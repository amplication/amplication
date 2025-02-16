import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { isEmpty } from "lodash";
import { JsonValue } from "type-fest";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { AmplicationError } from "../../errors/AmplicationError";
import { BlockVersion, User } from "../../models";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalytics.types";
import { BlockService } from "../block/block.service";
import { BlockTypeService } from "../block/blockType.service";
import { BlockMergeOptions } from "../block/dto/BlockMergeOptions";
import { BlockSettingsProperties } from "../block/types";
import { ResourceService } from "../resource/resource.service";
import { CreatePluginInstallationArgs } from "./dto/CreatePluginInstallationArgs";
import { DeletePluginOrderArgs } from "./dto/DeletePluginOrderArgs";
import { FindManyPluginInstallationArgs } from "./dto/FindManyPluginInstallationArgs";
import { PluginInstallation } from "./dto/PluginInstallation";
import { PluginOrder } from "./dto/PluginOrder";
import { PluginOrderItem } from "./dto/PluginOrderItem";
import { SetPluginOrderArgs } from "./dto/SetPluginOrderArgs";
import { UpdatePluginInstallationArgs } from "./dto/UpdatePluginInstallationArgs";
import { PluginOrderService } from "./pluginOrder.service";
import { PluginInstallationWhereInput } from "./dto/PluginInstallationWhereInput";

export const REQUIRES_AUTHENTICATION_ENTITY = "requireAuthenticationEntity";

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
    protected readonly logger: AmplicationLogger,
    @Inject(forwardRef(() => ResourceService))
    protected readonly resourceService: ResourceService,
    protected readonly pluginOrderService: PluginOrderService,
    private readonly analytics: SegmentAnalyticsService
  ) {
    super(blockService, logger);
  }

  async findPluginInstallationByPluginId(
    pluginId: string,
    where: PluginInstallationWhereInput
  ): Promise<PluginInstallation[]> {
    return this.findManyBySettings(
      {
        where,
      },
      {
        path: ["pluginId"],
        equals: pluginId,
      }
    );
  }

  async validatePluginConfiguration(
    resourceId: string,
    configurations: JsonValue,
    user: User
  ): Promise<void> {
    if (
      !configurations ||
      configurations[REQUIRES_AUTHENTICATION_ENTITY] !== "true"
    ) {
      return;
    }

    const authEntity = await this.resourceService.getAuthEntityName(
      resourceId,
      user
    );
    if (isEmpty(authEntity)) {
      throw new AmplicationError(
        "The plugin requires an authentication entity. Please select the authentication entity in the service settings."
      );
    }
    return;
  }

  async create(
    args: CreatePluginInstallationArgs,
    user: User
  ): Promise<PluginInstallation> {
    const { configurations, resource } = args.data;

    await this.validatePluginConfiguration(
      resource.connect.id,
      configurations,
      user
    );

    const existingPlugin = await this.findPluginInstallationByPluginId(
      args.data.pluginId,
      {
        resource: {
          id: resource.connect.id,
        },
      }
    );

    if (existingPlugin.length > 0) {
      throw new AmplicationError(
        `The Plugin ${args.data.pluginId} already installed in resource ${resource.connect.id}`
      );
    }

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

    await this.analytics.trackWithContext({
      event: EnumEventType.PluginInstall,
      properties: {
        pluginId: newPlugin.pluginId,
        pluginType: "official",
        resourceId: resource.connect.id,
      },
    });

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

    const updated = await super.update(args, user, ["settings"]);

    await this.analytics.trackWithContext({
      event: EnumEventType.PluginUpdate,
      properties: {
        pluginId: updated.pluginId,
        pluginType: "official",
        enabled: updated.enabled,
      },
    });

    return updated;
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

  async getInstalledPrivatePluginsForBuild(
    resourceId: string
  ): Promise<PluginInstallation[]> {
    const plugins = await this.findManyBySettings(
      {
        where: {
          resource: {
            id: resourceId,
          },
        },
      },
      {
        path: ["isPrivate"],
        equals: true,
      }
    );
    return plugins.filter((plugin) => plugin.enabled);
  }

  async getOrderedPluginInstallations(
    resourceId: string
  ): Promise<PluginInstallation[]> {
    const pluginOrder = await this.pluginOrderService.findByResourceId({
      where: { id: resourceId },
    });

    const resourcePluginInstallations = await super.findMany({
      where: {
        resource: {
          id: resourceId,
        },
      },
    });

    const orderedPluginInstallations: PluginInstallation[] = [];
    if (!pluginOrder) return resourcePluginInstallations;

    pluginOrder.order.forEach((pluginOrder) => {
      const current = resourcePluginInstallations.find(
        (plugin) => plugin.pluginId === pluginOrder.pluginId
      );
      current && orderedPluginInstallations.push(current);
    });

    return orderedPluginInstallations;
  }

  async mergeVersionIntoLatest(
    blockVersion: BlockVersion,
    targetResourceId: string,
    user: User,
    options: BlockMergeOptions
  ) {
    if (blockVersion.block.blockType !== EnumBlockType.PluginInstallation) {
      throw new AmplicationError(
        `The provided block (${blockVersion.block.blockType}) is not a PluginInstallation block.`
      );
    }

    const settings =
      blockVersion.settings as unknown as BlockSettingsProperties<PluginInstallation>;

    const existingPluginInstallations =
      await this.findPluginInstallationByPluginId(settings.pluginId, {
        resource: {
          id: targetResourceId,
        },
      });

    if (existingPluginInstallations.length > 0) {
      const existingPluginInstallation = existingPluginInstallations[0];
      if (options.updatedManuallyCreatedBlocks) {
        return this.update(
          {
            data: {
              //@todo: merge settings.settings with existing plugin installation
              ...settings,
              displayName: blockVersion.displayName,
            },
            where: {
              id: existingPluginInstallation.id,
            },
          },
          user
        );
      } else {
        //@todo: replace exception with logger or skip
        throw new AmplicationError(
          `The Plugin ${settings.pluginId} already installed in resource ${targetResourceId}`
        );
      }
    } else {
      return this.create(
        {
          data: {
            ...settings,
            isPrivate: settings.isPrivate,
            displayName: blockVersion.displayName,

            resource: {
              connect: {
                id: targetResourceId,
              },
            },
          },
        },
        user
      );
    }
  }
}
