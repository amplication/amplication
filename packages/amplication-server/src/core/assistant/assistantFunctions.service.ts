import { EnumModuleDtoType } from "@amplication/code-gen-types";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { pascalCase } from "pascal-case";
import { plural } from "pluralize";
import { EnumDataType } from "../../enums/EnumDataType";
import { Env } from "../../env";
import { Block } from "../../models";
import { EntityService } from "../entity/entity.service";
import { ModuleService } from "../module/module.service";
import { EnumModuleActionGqlOperation } from "../moduleAction/dto/EnumModuleActionGqlOperation";
import { EnumModuleActionRestInputSource } from "../moduleAction/dto/EnumModuleActionRestInputSource";
import { EnumModuleActionRestVerb } from "../moduleAction/dto/EnumModuleActionRestVerb";
import { ModuleActionService } from "../moduleAction/moduleAction.service";
import { ModuleDtoEnumMember } from "../moduleDto/dto/ModuleDtoEnumMember";
import { ModuleDtoPropertyUpdateInput } from "../moduleDto/dto/ModuleDtoPropertyUpdateInput";
import { PropertyTypeDef } from "../moduleDto/dto/propertyTypes/PropertyTypeDef";
import { ModuleDtoService } from "../moduleDto/moduleDto.service";
import { PluginCatalogService } from "../pluginCatalog/pluginCatalog.service";
import { PluginInstallationService } from "../pluginInstallation/pluginInstallation.service";
import { ProjectService } from "../project/project.service";
import { EnumPendingChangeOriginType } from "../resource/dto";
import { EnumResourceType } from "../resource/dto/EnumResourceType";
import { ResourceService } from "../resource/resource.service";
import { AssistantContext } from "./dto/AssistantContext";
import { EnumAssistantFunctions } from "./dto/EnumAssistantFunctions";
import { MessageLoggerContext } from "./assistant.service";
import { PermissionsService } from "../permissions/permissions.service";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { get } from "lodash";

export const MESSAGE_UPDATED_EVENT = "assistantMessageUpdated";

export const PLUGIN_LATEST_VERSION_TAG = "latest";

const FUNCTION_PERMISSIONS: {
  [key in EnumAssistantFunctions]: {
    paramType: AuthorizableOriginParameter;
    paramPath: string;
  };
} = {
  createEntities: {
    paramType: AuthorizableOriginParameter.ResourceId,
    paramPath: "serviceId",
  },
  createEntityFields: {
    paramType: AuthorizableOriginParameter.EntityId,
    paramPath: "entityId",
  },
  getProjectServices: {
    paramType: AuthorizableOriginParameter.ProjectId,
    paramPath: "projectId",
  },
  getServiceEntities: {
    paramType: AuthorizableOriginParameter.ResourceId,
    paramPath: "serviceId",
  },
  createService: {
    paramType: AuthorizableOriginParameter.ProjectId,
    paramPath: "projectId",
  },
  createProject: {
    paramType: AuthorizableOriginParameter.WorkspaceId,
    paramPath: "context.workspaceId",
  },
  commitProjectPendingChanges: {
    paramType: AuthorizableOriginParameter.ProjectId,
    paramPath: "projectId",
  },
  getProjectPendingChanges: {
    paramType: AuthorizableOriginParameter.ProjectId,
    paramPath: "projectId",
  },
  getPlugins: {
    paramType: AuthorizableOriginParameter.WorkspaceId,
    paramPath: "context.workspaceId",
  },
  installPlugins: {
    paramType: AuthorizableOriginParameter.ResourceId,
    paramPath: "serviceId",
  },
  getServiceModules: {
    paramType: AuthorizableOriginParameter.ResourceId,
    paramPath: "serviceId",
  },
  createModule: {
    paramType: AuthorizableOriginParameter.ResourceId,
    paramPath: "serviceId",
  },
  getModuleDtosAndEnums: {
    paramType: AuthorizableOriginParameter.ResourceId,
    paramPath: "serviceId",
  },
  createModuleDto: {
    paramType: AuthorizableOriginParameter.ResourceId,
    paramPath: "serviceId",
  },
  createModuleEnum: {
    paramType: AuthorizableOriginParameter.ResourceId,
    paramPath: "serviceId",
  },
  getModuleActions: {
    paramType: AuthorizableOriginParameter.ResourceId,
    paramPath: "serviceId",
  },
  createModuleAction: {
    paramType: AuthorizableOriginParameter.ResourceId,
    paramPath: "serviceId",
  },
};

@Injectable()
export class AssistantFunctionsService {
  private clientHost: string;

  constructor(
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger,
    private readonly entityService: EntityService,
    private readonly resourceService: ResourceService,
    private readonly moduleService: ModuleService,
    private readonly projectService: ProjectService,
    private readonly pluginCatalogService: PluginCatalogService,
    private readonly pluginInstallationService: PluginInstallationService,
    private readonly moduleActionService: ModuleActionService,
    private readonly moduleDtoService: ModuleDtoService,
    private readonly permissionsService: PermissionsService,

    configService: ConfigService
  ) {
    this.logger.info("starting assistant functions service");

    this.clientHost = configService.get<string>(Env.CLIENT_HOST);
  }

  async executeFunction(
    callId: string,
    functionName: string,
    params: string,
    context: AssistantContext,
    loggerContext: MessageLoggerContext
  ): Promise<{
    callId: string;
    results: string;
  }> {
    loggerContext.functionName = functionName;
    loggerContext.params = params;

    this.logger.info(`Chat: Executing function.`, loggerContext);

    const args = JSON.parse(params);

    if (this.assistantFunctions[functionName] !== undefined) {
      const hasAccess = await this.validatePermissions(
        functionName as EnumAssistantFunctions,
        context,
        args
      );

      if (!hasAccess) {
        this.logger.error(
          `Chat: User does not have access to resource: ${functionName}`,
          null,
          loggerContext
        );
        return {
          callId,
          results: "User does not have access to this resource",
        };
      }

      try {
        const result = await this.assistantFunctions[functionName].apply(null, [
          args,
          context,
          loggerContext,
        ]);

        return {
          callId,
          results: JSON.stringify(result),
        };
      } catch (error) {
        this.logger.error(
          `Chat: Error executing function: ${error.message}`,
          error,
          loggerContext
        );
        return {
          callId,
          results: JSON.stringify(error.message),
        };
      }
    } else {
      this.logger.error(
        `Chat: Function not found: ${functionName}`,
        null,
        loggerContext
      );
      return {
        callId,
        results: "Function not found",
      };
    }
  }

  async validatePermissions(
    functionName: EnumAssistantFunctions,
    context: AssistantContext,
    args: any
  ): Promise<boolean> {
    const permissions = FUNCTION_PERMISSIONS[functionName];
    if (!permissions) {
      return false;
    }

    if (
      permissions.paramType === AuthorizableOriginParameter.WorkspaceId &&
      permissions.paramPath === "context.workspaceId"
    ) {
      return true;
    }

    const parameterValue = get(args, permissions.paramPath);

    if (!parameterValue) {
      return false;
    }

    const hasAccess = await this.permissionsService.validateAccess(
      context.user,
      permissions.paramType,
      parameterValue
    );

    return hasAccess;
  }

  private assistantFunctions: {
    [key in EnumAssistantFunctions]: (
      args: any,
      context: AssistantContext,
      loggerContext?: MessageLoggerContext
    ) => any;
  } = {
    createEntities: async (
      args: {
        names: string[];
        serviceId: string;
      },
      context: AssistantContext,
      loggerContext: MessageLoggerContext
    ): Promise<any> => {
      const results = await Promise.all(
        args.names.map(async (entityName) => {
          let pluralDisplayName = plural(entityName);
          if (pluralDisplayName === entityName) {
            pluralDisplayName = `${entityName}Items`;
          }
          const entity = await this.entityService.createOneEntity(
            {
              data: {
                displayName: entityName,
                pluralDisplayName: pluralDisplayName,
                name: pascalCase(entityName),
                resource: {
                  connect: {
                    id: args.serviceId,
                  },
                },
              },
            },
            context.user
          );

          const defaultModuleId =
            await this.moduleService.getDefaultModuleIdForEntity(
              args.serviceId,
              entity.id
            );

          return {
            entityLink: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${args.serviceId}/entities/${entity.id}`,
            apisLink: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${args.serviceId}/modules/${defaultModuleId}`,
            result: entity,
          };
        })
      );

      return {
        allEntitiesLink: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${args.serviceId}/entities/`,
        allApisLink: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${args.serviceId}/modules/`,
        result: results,
      };
    },
    createEntityFields: async (
      args: {
        entityId: string;
        fields: { name: string; type: EnumDataType }[];
      },
      context: AssistantContext,
      loggerContext: MessageLoggerContext
    ): Promise<any> => {
      const entity = await this.entityService.entity({
        where: {
          id: args.entityId,
        },
      });

      const newFields = await Promise.all(
        args.fields?.map(async (field) => {
          try {
            return this.entityService.createFieldByDisplayName(
              {
                data: {
                  displayName: field.name,
                  dataType: field.type,
                  entity: {
                    connect: {
                      id: args.entityId,
                    },
                  },
                },
              },
              context.user
            );
          } catch (error) {
            this.logger.error(
              `Chat: Error creating field ${field.name} for entity ${entity.name}`,
              error,
              loggerContext
            );
          }
        })
      );

      return {
        entityLink: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${entity.resourceId}/entities/${entity.id}`,
        result: newFields,
      };
    },
    getProjectServices: async (
      args: { projectId: string },
      context: AssistantContext
    ) => {
      const resources = await this.resourceService.resources({
        where: {
          project: { id: args.projectId },
          resourceType: { equals: EnumResourceType.Service },
        },
      });
      return resources.map((resource) => ({
        id: resource.id,
        name: resource.name,
        description: resource.description,
        link: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${resource.id}`,
      }));
    },
    getServiceEntities: async (
      args: { serviceId: string },
      context: AssistantContext
    ) => {
      const entities = await this.entityService.entities({
        where: {
          resource: { id: args.serviceId },
        },
      });
      return entities.map((entity) => ({
        id: entity.id,
        name: entity.displayName,
        description: entity.description,
        link: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${context.resourceId}/entities/${entity.id}`,
      }));
    },
    createService: async (
      args: {
        serviceName: string;
        serviceDescription?: string;
        projectId: string;
        adminUIPath: string;
        serverPath: string;
      },
      context: AssistantContext
    ) => {
      const resource =
        await this.resourceService.createServiceWithDefaultSettings(
          args.serviceName,
          args.serviceDescription || "",
          args.projectId,
          args.adminUIPath,
          args.serverPath,
          context.user
        );
      return {
        link: `${this.clientHost}/${context.workspaceId}/${args.projectId}/${resource.id}`,
        result: {
          id: resource.id,
          name: resource.name,
          description: resource.description,
        },
      };
    },
    createProject: async (
      args: { projectName: string },
      context: AssistantContext
    ) => {
      const project = await this.projectService.createProject(
        {
          data: {
            name: args.projectName,
            workspace: {
              connect: {
                id: context.workspaceId,
              },
            },
          },
        },
        context.user.id
      );
      return {
        link: `${this.clientHost}/${context.workspaceId}/${project.id}`,
        connectToGitLink: `${this.clientHost}/${context.workspaceId}/${project.id}/git-sync`,
        result: {
          id: project.id,
          name: project.name,
        },
      };
    },
    commitProjectPendingChanges: async (
      args: { projectId: string; commitMessage: string },
      context: AssistantContext
    ) => {
      const commit = await this.projectService.commit(
        {
          data: {
            message: args.commitMessage,
            project: {
              connect: {
                id: args.projectId,
              },
            },
            user: {
              connect: {
                id: context.user.id,
              },
            },
          },
        },
        context.user
      );

      return {
        link: `${this.clientHost}/${context.workspaceId}/${args.projectId}/commits/${commit.id}`,
        result: commit,
      };
    },
    getProjectPendingChanges: async (
      args: { projectId: string },
      context: AssistantContext
    ) => {
      const changes = await this.projectService.getPendingChanges(
        {
          where: {
            project: { id: args.projectId },
          },
        },
        context.user
      );

      return changes.map((change) => ({
        id: change.originId,
        action: change.action,
        originType: change.originType,
        versionNumber: change.versionNumber,
        change: change.origin,
        description: change.origin.description,
        type:
          change.originType === EnumPendingChangeOriginType.Block
            ? (change.origin as Block).blockType
            : "Entity",
      }));
    },
    getPlugins: async (args: undefined, context: AssistantContext) => {
      return this.pluginCatalogService.getPlugins();
    },
    installPlugins: async (
      args: { pluginIds: string[]; serviceId: string },
      context: AssistantContext
    ) => {
      //iterate over the pluginIds and install each plugin synchronously
      //to support synchronous installation of multiple plugins we need first to fix the plugins order code in the pluginInstallation Service
      const installations = [];
      for (const pluginId of args.pluginIds) {
        const plugin =
          await this.pluginCatalogService.getPluginWithLatestVersion(pluginId);
        const pluginVersion = plugin.versions[0];

        const { version, settings, configurations } = pluginVersion;

        const installation = await this.pluginInstallationService.create(
          {
            data: {
              displayName: plugin.name,
              pluginId: pluginId,
              enabled: true,
              npm: plugin.npm,
              version: version,
              settings: settings,
              configurations: configurations,
              resource: { connect: { id: args.serviceId } },
            },
          },
          context.user
        );

        installations.push({
          result: installation,
          link: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${args.serviceId}/plugins/installed/${installation.id}`,
        });
      }

      return {
        installations,
        pluginsCatalogLink: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${args.serviceId}/plugins/catalog`,
        allInstalledPluginsLink: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${args.serviceId}/plugins/installed`,
      };
    },
    getServiceModules: async (
      args: { serviceId: string },
      context: AssistantContext
    ) => {
      const modules = await this.moduleService.findMany({
        where: {
          resource: { id: args.serviceId },
        },
      });
      return modules.map((module) => ({
        id: module.id,
        name: module.displayName,
        description: module.description,
        link: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${args.serviceId}/modules/${module.id}`,
      }));
    },
    createModule: async (
      args: {
        moduleName: string;
        moduleDescription: string;
        serviceId: string;
      },
      context: AssistantContext
    ) => {
      const name = pascalCase(args.moduleName);

      const module = await this.moduleService.create(
        {
          data: {
            name: name,
            displayName: args.moduleName,
            description: args.moduleDescription,
            resource: {
              connect: {
                id: args.serviceId,
              },
            },
          },
        },
        context.user
      );
      return {
        link: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${args.serviceId}/modules/${module.id}`,
        result: module,
      };
    },
    getModuleDtosAndEnums: async (
      args: { moduleId: string; serviceId: string },
      context: AssistantContext
    ) => {
      const dtos = await this.moduleDtoService.findMany({
        where: {
          parentBlock: { id: args.moduleId },
          resource: { id: args.serviceId },
          includeCustomDtos: true,
          includeDefaultDtos: true,
        },
      });
      return dtos.map((dto) => ({
        id: dto.id,
        name: dto.name,
        description: dto.description,
        dtoType: dto.dtoType,
        properties:
          dto.dtoType === EnumModuleDtoType.Custom
            ? dto.properties
            : "The properties for this DTO will be generated automatically on runtime based on the entity fields and relations.",
        members:
          dto.dtoType === EnumModuleDtoType.CustomEnum
            ? dto.members
            : "The members for this Enum will be generated automatically on runtime based on the entity field settings.",
        link: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${context.resourceId}/modules/${args.moduleId}/dtos/${dto.id}`,
      }));
    },
    createModuleDto: async (
      args: {
        moduleId: string;
        serviceId: string;
        dtoName: string;
        dtoDescription: string;
        properties: ModuleDtoPropertyUpdateInput[];
      },
      context: AssistantContext
    ) => {
      const name = pascalCase(args.dtoName);

      const module = await this.moduleService.findMany({
        where: {
          id: { equals: args.moduleId },
          resource: { id: args.serviceId },
        },
      });

      if (!module || module.length === 0) {
        throw new Error("Module not found");
      }

      const dto = await this.moduleDtoService.create(
        {
          properties: args.properties,
          data: {
            name: name,
            displayName: args.dtoName,
            description: args.dtoDescription,
            parentBlock: {
              connect: {
                id: args.moduleId,
              },
            },
            resource: {
              connect: {
                id: args.serviceId,
              },
            },
          },
        },
        context.user
      );
      return {
        link: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${args.serviceId}/modules/${args.moduleId}/dtos/${dto.id}`,
        result: dto,
      };
    },
    createModuleEnum: async (
      args: {
        moduleId: string;
        serviceId: string;
        enumName: string;
        enumDescription: string;
        members: ModuleDtoEnumMember[];
      },
      context: AssistantContext
    ) => {
      const name = pascalCase(args.enumName);

      const module = await this.moduleService.findMany({
        where: {
          id: { equals: args.moduleId },
          resource: { id: args.serviceId },
        },
      });

      if (!module || module.length === 0) {
        throw new Error("Module not found");
      }

      const dto = await this.moduleDtoService.createEnum(
        {
          members: args.members,
          data: {
            name: name,
            displayName: args.enumName,
            description: args.enumDescription,
            parentBlock: {
              connect: {
                id: args.moduleId,
              },
            },
            resource: {
              connect: {
                id: args.serviceId,
              },
            },
          },
        },
        context.user
      );
      return {
        link: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${args.serviceId}/modules/${args.moduleId}/dtos/${dto.id}`,
        result: dto,
      };
    },
    getModuleActions: async (
      args: { moduleId: string; serviceId: string },
      context: AssistantContext
    ) => {
      const actions = await this.moduleActionService.findMany({
        where: {
          parentBlock: { id: args.moduleId },
          resource: { id: args.serviceId },
        },
      });
      return actions.map((action) => ({
        id: action.id,
        name: action.displayName,
        description: action.description,
        gqlOperation: action.gqlOperation,
        restVerb: action.restVerb,
        path: action.path,
        inputType: action.inputType,
        outputType: action.outputType,
        link: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${args.serviceId}/modules/${args.moduleId}/actions/${action.id}`,
      }));
    },
    createModuleAction: async (
      args: {
        moduleId: string;
        serviceId: string;
        actionName: string;
        actionDescription: string;
        gqlOperation: EnumModuleActionGqlOperation;
        restVerb: EnumModuleActionRestVerb;
        path: string;
        inputType: PropertyTypeDef;
        outputType: PropertyTypeDef;
        restInputSource?: EnumModuleActionRestInputSource;
        restInputParamsPropertyName: string;
        restInputBodyPropertyName: string;
        restInputQueryPropertyName: string;
      },
      context: AssistantContext
    ) => {
      const name = pascalCase(args.actionName);

      const module = await this.moduleService.findMany({
        where: {
          id: { equals: args.moduleId },
          resource: { id: args.serviceId },
        },
      });

      if (!module || module.length === 0) {
        throw new Error("Module not found");
      }

      const action = await this.moduleActionService.create(
        {
          data: {
            displayName: args.actionName,
            name: name,
            parentBlock: {
              connect: {
                id: args.moduleId,
              },
            },
            resource: {
              connect: {
                id: args.serviceId,
              },
            },
          },
        },
        context.user
      );

      const updatedAction = await this.moduleActionService.update(
        {
          data: {
            displayName: args.actionName,
            name: name,
            description: args.actionDescription,
            gqlOperation: args.gqlOperation,
            restVerb: args.restVerb,
            path: args.path,
            inputType: args.inputType,
            outputType: args.outputType,
          },
          where: {
            id: action.id,
          },
        },
        context.user
      );
      return {
        link: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${args.serviceId}/modules/${args.moduleId}/actions/${action.id}`,
        result: updatedAction,
      };
    },
  };
}
