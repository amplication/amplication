import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Injectable } from "@nestjs/common";
import { AmplicationError } from "../../errors/AmplicationError";
import { Resource, User } from "../../models";
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

import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalytics.types";
import { PluginInstallationCreateInput } from "../pluginInstallation/dto/PluginInstallationCreateInput";
import { PluginInstallationService } from "../pluginInstallation/pluginInstallation.service";
import { EnumCodeGenerator } from "./dto/EnumCodeGenerator";
import { kebabCase } from "lodash";

@Injectable()
export class ServiceTemplateService {
  constructor(
    private readonly pluginInstallationService: PluginInstallationService,
    private readonly analyticsService: SegmentAnalyticsService,
    private readonly serviceSettingsService: ServiceSettingsService,
    private readonly logger: AmplicationLogger,
    private readonly resourceService: ResourceService
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

  /**
   * Create a resource of type "Service" from a Service Template
   */
  async createServiceFromTemplate(
    args: CreateServiceFromTemplateArgs,
    user: User
  ): Promise<Resource> {
    const serviceTemplates = await this.resourceService.resources({
      where: {
        id: args.data.serviceTemplate.id,
        resourceType: {
          equals: EnumResourceType.ServiceTemplate,
        },
        projectId: args.data.project.connect.id, //make sure the service template is in the same project
      },
    });

    if (!serviceTemplates || serviceTemplates.length === 0) {
      throw new AmplicationError(`Service template not found`);
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
      version: "1", //@Todo: get versions
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
          codeGenerator: serviceTemplates[0].codeGeneratorName
            ? CODE_GENERATOR_NAME_TO_ENUM[serviceTemplates[0].codeGeneratorName]
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
        templateName: serviceTemplates[0].name,
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
}
