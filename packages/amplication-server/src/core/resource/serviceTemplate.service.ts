import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Injectable } from "@nestjs/common";
import { AmplicationError } from "../../errors/AmplicationError";
import { BlockVersion, IBlock, Resource, User } from "../../models";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { ServiceSettingsService } from "../serviceSettings/serviceSettings.service";
import { FindManyResourceArgs } from "./dto";
import { CreateServiceFromTemplateArgs } from "./dto/CreateServiceFromTemplateArgs";
import { CreateServiceTemplateArgs } from "./dto/CreateServiceTemplateArgs";
import { EnumResourceType } from "./dto/EnumResourceType";
import {
  CODE_GENERATOR_NAME_TO_ENUM,
  ResourceService,
} from "./resource.service";

import { kebabCase } from "lodash";
import { FindOneArgs } from "../../dto";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { PrismaService } from "../../prisma";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalytics.types";
import { BlockMergeOptions } from "../block/dto/BlockMergeOptions";
import { BlockSettingsProperties } from "../block/types";
import { OutdatedVersionAlertService } from "../outdatedVersionAlert/outdatedVersionAlert.service";
import { PluginInstallationCreateInput } from "../pluginInstallation/dto/PluginInstallationCreateInput";
import { PluginInstallationService } from "../pluginInstallation/pluginInstallation.service";
import { ProjectService } from "../project/project.service";
import { ResourceVersionsDiffBlock } from "../resourceVersion/dto/ResourceVersionsDiffBlock";
import { ResourceVersionService } from "../resourceVersion/resourceVersion.service";
import { TemplateCodeEngineVersion } from "../templateCodeEngineVersion/dto/TemplateCodeEngineVersion";
import { EnumCodeGenerator } from "./dto/EnumCodeGenerator";
import { EnumResourceTypeGroup } from "./dto/EnumResourceTypeGroup";
import { ScaffoldServiceFromTemplateArgs } from "./dto/ScaffoldServiceFromTemplateArgs";
import { FindAvailableTemplatesForProjectArgs } from "./dto/FindAvailableTemplatesForProjectArgs";
import { EnumCommitStrategy } from "./dto/EnumCommitStrategy";

@Injectable()
export class ServiceTemplateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pluginInstallationService: PluginInstallationService,
    private readonly analyticsService: SegmentAnalyticsService,
    private readonly serviceSettingsService: ServiceSettingsService,
    private readonly logger: AmplicationLogger,
    private readonly resourceService: ResourceService,
    private readonly resourceVersionService: ResourceVersionService,
    private readonly outdatedVersionAlertService: OutdatedVersionAlertService,
    private readonly projectService: ProjectService
  ) {}

  /**
   * Create a resource of type "Service Template"
   */
  async createServiceTemplate(
    args: CreateServiceTemplateArgs,
    user: User
  ): Promise<Resource> {
    const { serviceSettings, ...rest } = args.data.resource;

    const resource = await this.resourceService.createResource(
      {
        data: {
          ...rest,
          resourceType: EnumResourceType.ServiceTemplate,
        },
      },
      user
    );

    await this.resourceService.createServiceDefaultObjects(
      resource,
      user,
      false,
      serviceSettings
    );

    if (args.data.plugins?.plugins) {
      await this.resourceService.installPlugins(
        resource.id,
        args.data.plugins.plugins,
        user
      );
    }

    return resource;
  }

  //return the list of templates in the project
  async serviceTemplates(args: FindManyResourceArgs): Promise<Resource[]> {
    return this.resourceService.resources({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
        archived: { not: true },
        resourceType: {
          equals: EnumResourceType.ServiceTemplate,
        },
      },
    });
  }

  async scaffoldServiceFromTemplate(
    args: ScaffoldServiceFromTemplateArgs,
    user: User
  ): Promise<Resource> {
    const { name, serviceTemplateName, project } = args.data;

    const serviceTemplates = await this.availableServiceTemplatesForProject(
      {
        where: {
          id: args.data.project.connect.id,
        },
      },
      user
    );

    if (!serviceTemplates || serviceTemplates.length === 0) {
      throw new AmplicationError(`Service template not found`);
    }

    const template = serviceTemplates.find(
      (template) => template.name === serviceTemplateName
    );

    //check that the selected template belongs to the project and available for the user
    if (template === undefined) {
      throw new AmplicationError(`Service template not found`);
    }

    const newResource = await this.createServiceFromTemplate(
      {
        data: {
          serviceTemplate: { id: template.id },
          project: { connect: { id: project.connect.id } },
          name,
          description: "",
        },
      },
      user
    );

    //commit new service

    await this.projectService.commit(
      {
        data: {
          resourceTypeGroup: EnumResourceTypeGroup.Services,
          message: `commit new scaffold service: ${name}`,
          project: {
            connect: {
              id: project.connect.id,
            },
          },
          commitStrategy: EnumCommitStrategy.Specific,
          resourceIds: [newResource.id],
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      },
      user
    );

    return newResource;
  }

  /**
   * Return the list of templates available for resources in the project,
   * including the ones that are available from other public projects.
   * Only returns templates that have versions (published templates)
   * @param args
   * @param user
   * @returns
   */

  async availableServiceTemplatesForProject(
    args: FindAvailableTemplatesForProjectArgs,
    user: User
  ): Promise<Resource[]> {
    const workspaceId = user.workspace.id;

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

    return this.prisma.resource.findMany({
      ...args,
      where: {
        projectId: {
          in: [...publicProjects.map((project) => project.id), args.where.id],
        },
        deletedAt: null,
        archived: { not: true },
        resourceType: {
          equals: EnumResourceType.ServiceTemplate,
        },
        resourceVersions: {
          //only return templates that have versions
          some: {},
        },
      },
    });
  }

  /**
   * Create a resource of type "Service" from a Service Template
   */
  async createServiceFromTemplate(
    args: CreateServiceFromTemplateArgs,
    user: User
  ): Promise<Resource> {
    const serviceTemplates = await this.availableServiceTemplatesForProject(
      {
        where: {
          id: args.data.project.connect.id,
        },
      },
      user
    );

    if (!serviceTemplates || serviceTemplates.length === 0) {
      throw new AmplicationError(`Service template not found`);
    }
    //check that the selected template belongs to the project and available for the user
    if (
      serviceTemplates.find(
        (template) => template.id === args.data.serviceTemplate.id
      ) === undefined
    ) {
      throw new AmplicationError(`Service template not found`);
    }

    const template = serviceTemplates[0];

    const templateVersion = await this.resourceVersionService.getLatest(
      template.id
    );

    if (!templateVersion) {
      throw new AmplicationError(`Template version not found`);
    }

    const serviceSettings =
      await this.serviceSettingsService.getServiceSettingsValues(
        {
          where: {
            id: args.data.serviceTemplate.id,
          },
        },
        user
      );

    delete serviceSettings.resourceId;
    serviceSettings.serviceTemplateVersion = {
      serviceTemplateId: args.data.serviceTemplate.id,
      version: templateVersion.version,
    };

    const kebabCaseServiceName = kebabCase(args.data.name);

    serviceSettings.adminUISettings.adminUIPath =
      serviceSettings.adminUISettings.adminUIPath.replace(
        "{{SERVICE_NAME}}",
        kebabCaseServiceName
      );

    serviceSettings.serverSettings.serverPath =
      serviceSettings.serverSettings.serverPath.replace(
        "{{SERVICE_NAME}}",
        kebabCaseServiceName
      );

    const newService = await this.resourceService.createService(
      {
        data: {
          name: args.data.name,
          description: args.data.description,
          resourceType: EnumResourceType.Service,
          project: args.data.project,
          serviceSettings: serviceSettings,
          codeGenerator: template.codeGeneratorName
            ? CODE_GENERATOR_NAME_TO_ENUM[template.codeGeneratorName]
            : EnumCodeGenerator.NodeJs,
        },
      },
      user
    );

    await this.copyTemplatePluginInstallations(
      args.data.serviceTemplate.id,
      newService.id,
      user
    );

    await this.analyticsService.trackWithContext({
      event: EnumEventType.CreateServiceFromTemplate,
      properties: {
        templateName: template.name,
        serviceName: newService.name,
      },
    });

    return newService;
  }

  async copyTemplatePluginInstallations(
    sourceTemplateId: string,
    targetServiceId: string,
    user: User
  ) {
    const plugins = await this.pluginInstallationService.findMany({
      where: {
        resource: {
          id: sourceTemplateId,
        },
      },
    });

    //@todo: after merging with next, get the ordered list of plugins

    for (const plugin of plugins) {
      const createInput: PluginInstallationCreateInput = {
        pluginId: plugin.pluginId,
        enabled: plugin.enabled,
        npm: plugin.npm,
        version: plugin.version,
        displayName: plugin.displayName,
        isPrivate: plugin.isPrivate ?? false,
        settings: plugin.settings,
        configurations: plugin.configurations,
        resource: {
          connect: {
            id: targetServiceId,
          },
        },
      };

      await this.pluginInstallationService.create(
        {
          data: {
            ...createInput,
          },
        },
        user
      );
    }
  }

  //@todo:
  // service update settings :
  // service template only
  // service template first, and individual plugins that are not part of the template
  // service template and all plugins, including the ones that are part of the template

  async upgradeServiceToLatestTemplateVersion(
    args: FindOneArgs,
    user: User
  ): Promise<Resource> {
    const resourceId = args.where.id;

    const resource = await this.resourceService.resource({
      where: {
        id: resourceId,
      },
    });

    if (!resource) {
      throw new AmplicationError(`Resource with id ${resourceId} not found `);
    }

    if (resource.resourceType !== EnumResourceType.Service) {
      throw new AmplicationError(
        `Resource with id ${resourceId} is not a service `
      );
    }

    const serviceTemplateVersion =
      await this.resourceService.getServiceTemplateSettings(resourceId, user);

    if (!serviceTemplateVersion) {
      throw new AmplicationError(
        `Service with id ${resourceId} is not based on a template `
      );
    }

    const template = await this.resourceService.resource({
      where: {
        id: serviceTemplateVersion.serviceTemplateId,
      },
    });

    if (!template) {
      throw new AmplicationError(
        `Template with id ${serviceTemplateVersion.serviceTemplateId} not found `
      );
    }

    const latestVersion = await this.resourceVersionService.getLatest(
      template.id
    );

    if (latestVersion.version === serviceTemplateVersion.version) {
      throw new AmplicationError(
        `Service with id ${resourceId} is already up to date `
      );
    }

    const changes = await this.resourceVersionService.compareResourceVersions({
      where: {
        resource: { id: template.id },
        sourceVersion: serviceTemplateVersion.version,
        targetVersion: latestVersion.version,
      },
    });

    const mergeOptions: BlockMergeOptions = {
      updatedManuallyCreatedBlocks: true,
    };

    //create new plugins from the template
    const createdPromises = changes.createdBlocks.map(async (blockVersion) => {
      return this.handleMergeCreatedBlock(
        resourceId,
        blockVersion,
        user,
        mergeOptions
      );
    });

    //delete plugins that were removed from the template
    //@todo - allow the user to decide if they want to delete the plugin or keep it
    const deletedPromises = changes.deletedBlocks.map(async (blockVersion) => {
      return this.handleMergeDeletedBlock(resourceId, blockVersion, user);
    });

    //update plugins that were changed in the template
    //@todo - allow the user to decide if they want to update the plugin or keep it
    const updatedPromises = changes.updatedBlocks.forEach(async (diff) => {
      return this.handleMergeUpdatedBlock(resourceId, diff, user, mergeOptions);
    });

    await Promise.all([createdPromises, deletedPromises, updatedPromises]);

    await this.serviceSettingsService.updateServiceTemplateVersion(
      resourceId,
      latestVersion.version,
      user
    );

    await this.outdatedVersionAlertService.resolvesServiceTemplateUpdated({
      resourceId: resourceId,
    });

    return resource;
  }

  async handleMergeCreatedBlock(
    targetResourceId: string,
    blockVersion: BlockVersion,
    user: User,
    options: BlockMergeOptions
  ): Promise<IBlock | Resource> {
    if (blockVersion.block.blockType === EnumBlockType.PluginInstallation) {
      return this.pluginInstallationService.mergeVersionIntoLatest(
        blockVersion,
        targetResourceId,
        user,
        options
      );
    }

    if (blockVersion.block.blockType === EnumBlockType.CodeEngineVersion) {
      const settings =
        blockVersion.settings as unknown as BlockSettingsProperties<TemplateCodeEngineVersion>;

      return this.resourceService.updateCodeGeneratorVersion(
        {
          data: {
            codeGeneratorVersionOptions: {
              codeGeneratorVersion: settings.codeGeneratorVersion,
              codeGeneratorStrategy: settings.codeGeneratorStrategy,
            },
          },
          where: {
            id: targetResourceId,
          },
        },
        user
      );
    }
  }

  async handleMergeDeletedBlock(
    targetResourceId: string,
    blockVersion: BlockVersion,
    user: User
  ): Promise<void> {
    return;
  }

  async handleMergeUpdatedBlock(
    targetResourceId: string,
    diff: ResourceVersionsDiffBlock,
    user: User,
    options: BlockMergeOptions
  ): Promise<IBlock | Resource> {
    if (
      diff.sourceBlockVersion.block.blockType ===
      EnumBlockType.PluginInstallation
    ) {
      return this.pluginInstallationService.mergeVersionIntoLatest(
        diff.targetBlockVersion,
        targetResourceId,
        user,
        options
      );
    }

    if (
      diff.sourceBlockVersion.block.blockType ===
      EnumBlockType.CodeEngineVersion
    ) {
      const settings = diff.targetBlockVersion
        .settings as unknown as BlockSettingsProperties<TemplateCodeEngineVersion>;

      return this.resourceService.updateCodeGeneratorVersion(
        {
          data: {
            codeGeneratorVersionOptions: {
              codeGeneratorVersion: settings.codeGeneratorVersion,
              codeGeneratorStrategy: settings.codeGeneratorStrategy,
            },
          },
          where: {
            id: targetResourceId,
          },
        },
        user
      );
    }
  }
}
