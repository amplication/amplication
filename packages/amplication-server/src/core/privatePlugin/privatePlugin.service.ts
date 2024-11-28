import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { BlockService } from "../block/block.service";
import { BlockTypeService } from "../block/blockType.service";
import { CreatePrivatePluginArgs } from "./dto/CreatePrivatePluginArgs";
import { FindManyPrivatePluginArgs } from "./dto/FindManyPrivatePluginArgs";
import { PrivatePlugin } from "./dto/PrivatePlugin";
import { UpdatePrivatePluginArgs } from "./dto/UpdatePrivatePluginArgs";
import { DeletePrivatePluginArgs } from "./dto/DeletePrivatePluginArgs";
import { User } from "../../models";
import { BillingService } from "../billing/billing.service";
import { BillingFeature } from "@amplication/util-billing-types";
import { AmplicationError } from "../../errors/AmplicationError";
import {
  CODE_GENERATOR_NAME_TO_ENUM,
  ResourceService,
} from "../resource/resource.service";
import { CreatePrivatePluginVersionArgs } from "./dto/CreatePrivatePluginVersionArgs";
import { PrivatePluginVersion } from "./dto/PrivatePluginVersion";
import { UpdatePrivatePluginVersionArgs } from "./dto/UpdatePrivatePluginVersionArgs";
import { EnumCodeGenerator } from "../resource/dto/EnumCodeGenerator";
import { BlockSettingsProperties } from "../block/types";
import { JsonFilter } from "../../dto/JsonFilter";
import { WhereUniqueInput } from "../../dto";
import { GitProviderService } from "../git/git.provider.service";
import { EnumGitFolderContentItemType } from "../git/dto/objects/EnumGitFolderContentItemType";
import { GitFolderContent } from "../git/dto/objects/GitFolderContent";
import { ProjectService } from "../project/project.service";

const DEFAULT_PRIVATE_PLUGIN_VERSION: Omit<PrivatePluginVersion, "version"> = {
  deprecated: false,
  enabled: true,
  settings: null,
  configurations: null,
};

const REMOTE_GIT_PLUGIN_PATH = "plugins";

export type PrivatePluginBlockVersionSettings =
  BlockSettingsProperties<PrivatePlugin> & {
    versions: PrivatePluginVersion[];
  };

export const PRIVATE_PLUGIN_DEV_VERSION = "@dev";

@Injectable()
export class PrivatePluginService extends BlockTypeService<
  PrivatePlugin,
  FindManyPrivatePluginArgs,
  CreatePrivatePluginArgs,
  UpdatePrivatePluginArgs,
  DeletePrivatePluginArgs
> {
  blockType = EnumBlockType.PrivatePlugin;

  constructor(
    protected readonly blockService: BlockService,
    protected readonly logger: AmplicationLogger,
    protected readonly billingService: BillingService,
    @Inject(forwardRef(() => ResourceService))
    protected readonly resourceService: ResourceService,
    protected readonly gitProviderService: GitProviderService,
    @Inject(forwardRef(() => ProjectService))
    protected readonly projectService: ProjectService
  ) {
    super(blockService, logger);
  }

  //return all private plugins in the resource's project, and other public projects in the workspace
  //disabled plugins can be used for setup - but should not be used in build time
  async availablePrivatePluginsForResource(
    args: FindManyPrivatePluginArgs
  ): Promise<PrivatePlugin[]> {
    const resource = await this.resourceService.resource(
      {
        where: {
          id: args.where?.resource.id,
        },
      },
      {
        project: true,
      }
    );

    if (!resource) {
      return [];
    }

    const workspaceId = resource.project?.workspaceId;

    if (!resource) {
      return [];
    }

    const publicProjects = await this.projectService.findProjects({
      where: {
        workspace: {
          id: workspaceId,
        },
        platformIsPublic: {
          equals: true,
        },
      },
    });

    const filter: JsonFilter[] = [
      {
        path: ["codeGenerator"],
        equals:
          CODE_GENERATOR_NAME_TO_ENUM[resource.codeGeneratorName] ||
          EnumCodeGenerator.NodeJs,
      },
    ];

    if (resource.blueprintId) {
      filter.push({
        path: ["blueprints"],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        array_contains: resource.blueprintId,
      });
    }

    return this.findManyBySettings(
      {
        ...args,
        where: {
          ...args.where,
          resource: {
            deletedAt: null,
            archived: {
              not: true,
            },

            projectId: {
              in: [
                ...publicProjects.map((project) => project.id),
                resource.projectId,
              ],
            },
          },
        },
      },
      filter,
      "AND",
      true
    );
  }

  async findMany(
    args: FindManyPrivatePluginArgs,
    user?: User,
    takeLatestVersion?: boolean
  ): Promise<PrivatePlugin[]> {
    const codeGeneratorFilter = args.where?.codeGenerator;
    delete args.where?.codeGenerator;

    if (codeGeneratorFilter) {
      const filter = {
        path: ["codeGenerator"],
        equals: codeGeneratorFilter.equals,
      };

      return this.findManyBySettings(
        args,
        filter,
        undefined,
        takeLatestVersion
      );
    }

    return super.findMany(args, user, takeLatestVersion);
  }

  async create(
    args: CreatePrivatePluginArgs,
    user: User
  ): Promise<PrivatePlugin> {
    await this.validateLicense(user.workspace?.id);

    const privatePlugin = await super.create(args, user);

    await this.createVersion(
      {
        data: {
          version: PRIVATE_PLUGIN_DEV_VERSION,
          privatePlugin: { connect: { id: privatePlugin.id } },
        },
      },
      user
    );

    return privatePlugin;
  }

  async validateLicense(workspaceId: string): Promise<void> {
    const entitlement = await this.billingService.getBooleanEntitlement(
      workspaceId,
      BillingFeature.PrivatePlugins
    );

    if (entitlement && !entitlement.hasAccess)
      throw new AmplicationError(
        `Feature Unavailable. Please upgrade your plan to use the Private Plugins Module.`
      );
  }

  async createVersion(
    args: CreatePrivatePluginVersionArgs,
    user: User
  ): Promise<PrivatePluginVersion> {
    const plugin = await super.findOne({
      where: { id: args.data.privatePlugin.connect.id },
    });
    if (!plugin) {
      throw new AmplicationError(
        `Private Plugin not found, ID: ${args.data.privatePlugin.connect.id}`
      );
    }

    const existingVersion = plugin.versions?.find(
      (property) => property.version === args.data.version
    );
    if (existingVersion) {
      throw new AmplicationError(
        `Version already exists, version: ${args.data.version}, Private Plugin ID: ${args.data.privatePlugin.connect.id}`
      );
    }

    const newVersion: PrivatePluginVersion = {
      ...DEFAULT_PRIVATE_PLUGIN_VERSION,
      version: args.data.version,
    };

    await super.update(
      {
        where: { id: plugin.id },
        data: {
          enabled: plugin.enabled,
          versions: [...(plugin.versions || []), newVersion],
        },
      },
      user
    );

    return newVersion;
  }

  async updateVersion(
    args: UpdatePrivatePluginVersionArgs,
    user: User
  ): Promise<PrivatePluginVersion> {
    const plugin = await super.findOne({
      where: { id: args.where.privatePlugin.id },
    });
    if (!plugin) {
      throw new AmplicationError(
        `Private Plugin not found, ID: ${args.where.privatePlugin.id}`
      );
    }

    const existingVersionIndex = plugin.versions?.findIndex(
      (version) => version.version === args.where.version
    );

    if (existingVersionIndex === -1) {
      throw new AmplicationError(
        `Private Plugin Version not found, version: ${args.where.version}, Private Plugin ID: ${args.where.privatePlugin.id}`
      );
    }

    const existingVersion = plugin.versions[existingVersionIndex];

    const updatedVersion = {
      ...existingVersion,
      ...args.data,
    };

    plugin.versions[existingVersionIndex] = updatedVersion;

    await super.update(
      {
        where: { id: plugin.id },
        data: {
          enabled: plugin.enabled,
          versions: plugin.versions,
        },
      },
      user
    );

    return updatedVersion;
  }

  async getPrivatePluginListFromRemoteRepository(
    resource: WhereUniqueInput
  ): Promise<GitFolderContent> {
    const folderContent =
      await this.gitProviderService.getGitFolderContentForResourceRepo({
        resourceId: resource.id,
        path: REMOTE_GIT_PLUGIN_PATH,
      });

    return {
      content: folderContent.content.filter(
        (item) => item.type === EnumGitFolderContentItemType.Dir.toString()
      ),
    };
  }
}
