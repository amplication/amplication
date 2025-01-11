import { EnumDataType, EnumModuleDtoType } from "@amplication/code-gen-types";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { get, isEmpty } from "lodash";
import { pascalCase } from "pascal-case";
import { isPlural, plural, singular } from "pluralize";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { Env } from "../../env";
import { Block } from "../../models";
import { JsonSchemaValidationService } from "../../services/jsonSchemaValidation.service";
import { EntityService } from "../entity/entity.service";
import { ModuleService } from "../module/module.service";
import { ModuleActionService } from "../moduleAction/moduleAction.service";
import { ModuleDtoService } from "../moduleDto/moduleDto.service";
import { PermissionsService } from "../permissions/permissions.service";
import { PluginCatalogService } from "../pluginCatalog/pluginCatalog.service";
import {
  PluginInstallationService,
  REQUIRES_AUTHENTICATION_ENTITY,
} from "../pluginInstallation/pluginInstallation.service";
import { ProjectService } from "../project/project.service";
import { EnumPendingChangeOriginType } from "../resource/dto";
import { EnumResourceType } from "../resource/dto/EnumResourceType";
import {
  CODE_GENERATOR_NAME_TO_ENUM,
  ResourceService,
} from "../resource/resource.service";
import { MessageLoggerContext } from "./assistant.service";
import { AssistantContext } from "./dto/AssistantContext";
import { EnumAssistantFunctions } from "./dto/EnumAssistantFunctions";
import * as functionArgsSchemas from "./functions/";
import * as functionsArgsTypes from "./functions/types";
import { USER_ENTITY_NAME } from "../entity/constants";
import { EnumCodeGenerator } from "../resource/dto/EnumCodeGenerator";
import { EnumResourceTypeGroup } from "../resource/dto/EnumResourceTypeGroup";

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
  getService: {
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
    private readonly jsonSchemaValidationService: JsonSchemaValidationService,

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
        await this.validateFunctionArgs(
          functionName as EnumAssistantFunctions,
          args
        );
      } catch (error) {
        this.logger.error(
          `Chat: Error validating function arguments: ${error.message}`,
          error,
          loggerContext
        );
        return {
          callId,
          results: error.message,
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
      parameterValue,
      []
    );

    return hasAccess;
  }

  async validateFunctionArgs(
    functionName: EnumAssistantFunctions,
    args: any
  ): Promise<undefined> {
    const schema = functionArgsSchemas[functionName]?.parameters;

    if (!schema) {
      throw new Error(`Function schema not found for ${functionName}`);
    }

    const schemaValidation =
      await this.jsonSchemaValidationService.validateSchema(schema, args);

    if (!schemaValidation.isValid) {
      throw new Error(`Invalid arguments: ${schemaValidation.errorText}`);
    }
  }

  async installMultiplePlugins(
    pluginIds: string[],
    serviceId: string,
    context: AssistantContext
  ): Promise<any> {
    //iterate over the pluginIds and install each plugin synchronously
    //to support synchronous installation of multiple plugins we need first to fix the plugins order code in the pluginInstallation Service
    const installations = [];
    let authEntityExist = false;

    const service = await this.resourceService.resource({
      where: {
        id: serviceId,
      },
    });

    if (!service) {
      throw new Error(`Service with id ${serviceId} not found`);
    }

    const codeGenerator =
      CODE_GENERATOR_NAME_TO_ENUM[service.codeGeneratorName] ||
      EnumCodeGenerator.NodeJs;

    for (const pluginId of pluginIds) {
      const plugin = await this.pluginCatalogService.getPluginWithLatestVersion(
        pluginId
      );
      const pluginVersion = plugin.versions[0];

      if (plugin.codeGeneratorName !== codeGenerator) {
        installations.push({
          result: `Plugin not installed. Plugin code generator "${plugin.codeGeneratorName}" is not compatible with the service code generator ${codeGenerator}`,
        });
        continue;
      }

      const { version, settings, configurations } = pluginVersion;

      if (
        configurations &&
        configurations[REQUIRES_AUTHENTICATION_ENTITY] === "true" &&
        !authEntityExist
      ) {
        const authEntityName = await this.resourceService.getAuthEntityName(
          serviceId,
          context.user
        );
        if (!isEmpty(authEntityName)) {
          authEntityExist = true;
        } else {
          //create auth entity
          await this.resourceService.createDefaultAuthEntity(
            serviceId,
            context.user
          );
          authEntityExist = true;
        }
      }

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
            resource: { connect: { id: serviceId } },
            isPrivate: false,
          },
        },
        context.user
      );

      installations.push({
        result: installation,
        link: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${serviceId}/plugins/installed/${installation.id}`,
      });
    }

    return {
      installations,
      pluginsCatalogLink: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${serviceId}/plugins/catalog`,
      allInstalledPluginsLink: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${serviceId}/plugins/installed`,
    };
  }

  private assistantFunctions: {
    [key in EnumAssistantFunctions]: (
      args: any,
      context: AssistantContext,
      loggerContext?: MessageLoggerContext
    ) => any;
  } = {
    createEntities: async (
      args: functionsArgsTypes.CreateEntities,
      context: AssistantContext,
      loggerContext: MessageLoggerContext
    ): Promise<any> => {
      const results = await Promise.all(
        args.names.map(async (entityName) => {
          let pluralDisplayName = plural(entityName);
          if (pluralDisplayName === entityName) {
            pluralDisplayName = `${entityName}Items`;
          }
          try {
            let entity;
            if (
              singular(entityName.toLowerCase()) ===
              USER_ENTITY_NAME.toLowerCase()
            ) {
              try {
                entity = await this.resourceService.createDefaultAuthEntity(
                  args.serviceId,
                  context.user
                );
              } catch (error) {
                this.logger.warn(
                  `Chat: Error creating default auth entity ${entityName}. Continue creating regular entity`,
                  error,
                  loggerContext
                );
              }
            }

            if (!entity) {
              entity = await this.entityService.createOneEntity(
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
            }

            const fields = await this.entityService.getFields(entity.id, {});

            const defaultModuleId =
              await this.moduleService.getDefaultModuleIdForEntity(
                args.serviceId,
                entity.id
              );

            return {
              entityLink: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${args.serviceId}/entities/${entity.id}`,

              apisLink: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${args.serviceId}/modules/${defaultModuleId}`,
              result: {
                entity,
                fields: fields.map((field) => ({
                  id: field.id,
                  name: field.name,
                  type: field.dataType,
                })),
              },
            };
          } catch (error) {
            this.logger.error(
              `Chat: Error creating entity ${entityName}: ${error.message}`,
              error,
              loggerContext
            );
            return {
              entityLink: null,
              apisLink: null,
              result: null,
              error: error.message,
            };
          }
        })
      );

      return {
        allEntitiesErdViewLink: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${args.serviceId}/entities?view=erd`,
        allApisLink: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${args.serviceId}/modules/`,
        result: results,
      };
    },
    createEntityFields: async (
      args: functionsArgsTypes.CreateEntityFields,
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
          //Jovu currently supports only one-many relations.
          //@todo: This validation should be changed after adding support for one-one/ many-many relations.
          if (field.type === EnumDataType.Lookup && isPlural(field.name)) {
            return {
              error: `a lookup field [${field.name}] that is the many side of the relation can not be created because it is already created on the one side of the relation`,
            };
          }

          try {
            return await this.entityService.createFieldByDisplayName(
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
              context.user,
              true
            );
          } catch (error) {
            this.logger.error(
              `Chat: Error creating field ${field.name} for entity ${entity.name}`,
              error,
              loggerContext
            );
            if (error.code === "P2002") {
              return {
                fieldName: field.name,
                error:
                  "Field name already exists, let the user know and ask to choose a different name or do not create the field",
              };
            }
            return {
              fieldName: field.name,
              error: error.message,
            };
          }
        })
      );

      return {
        entityLink: `${this.clientHost}/${context.workspaceId}/${context.projectId}/${entity.resourceId}/entities/${entity.id}`,
        result: newFields,
      };
    },
    getProjectServices: async (
      args: functionsArgsTypes.GetProjectServices,
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
        codeGenerator:
          CODE_GENERATOR_NAME_TO_ENUM[resource.codeGeneratorName] ||
          EnumCodeGenerator.NodeJs,
        link: `${this.clientHost}/${context.workspaceId}/${args.projectId}/${resource.id}`,
      }));
    },
    getServiceEntities: async (
      args: functionsArgsTypes.GetServiceEntities,
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
      args: functionsArgsTypes.CreateService,
      context: AssistantContext
    ) => {
      const needDefaultDbPlugin = !(
        args.pluginIds &&
        args.pluginIds.find((pluginId) => pluginId.startsWith("db-"))
      );

      const resource =
        await this.resourceService.createServiceWithDefaultSettings(
          args.serviceName,
          args.serviceDescription || "",
          args.projectId,
          context.user,
          needDefaultDbPlugin,
          args.codeGenerator
        );

      let pluginsResults = null;
      if (args.pluginIds && args.pluginIds.length > 0) {
        pluginsResults = await this.installMultiplePlugins(
          args.pluginIds,
          resource.id,
          context
        );
      }

      return {
        link: `${this.clientHost}/${context.workspaceId}/${args.projectId}/${resource.id}`,
        result: {
          id: resource.id,
          name: resource.name,
          description: resource.description,
        },
        pluginsResults,
      };
    },
    createProject: async (
      args: functionsArgsTypes.CreateProject,
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
      args: functionsArgsTypes.CommitProjectPendingChanges,
      context: AssistantContext
    ) => {
      const commit = await this.projectService.commit(
        {
          data: {
            resourceTypeGroup: EnumResourceTypeGroup.Services,
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
      args: functionsArgsTypes.GetProjectPendingChanges,
      context: AssistantContext
    ) => {
      const changes = await this.projectService.getPendingChanges(
        {
          where: {
            project: { id: args.projectId },
            //@todo: add support for platform changes via Jovu
            resourceTypeGroup: EnumResourceTypeGroup.Services,
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
    getPlugins: async (
      args: functionsArgsTypes.GetPlugins,
      context: AssistantContext
    ) => {
      return this.pluginCatalogService.getPlugins(args.codeGenerator);
    },
    installPlugins: async (
      args: functionsArgsTypes.InstallPlugins,
      context: AssistantContext
    ) => {
      return this.installMultiplePlugins(
        args.pluginIds,
        args.serviceId,
        context
      );
    },
    getService: async (
      args: functionsArgsTypes.GetService,
      context: AssistantContext
    ) => {
      const resource = await this.resourceService.resource({
        where: {
          id: args.serviceId,
        },
      });
      return {
        id: resource.id,
        name: resource.name,
        description: resource.description,
        codeGenerator:
          CODE_GENERATOR_NAME_TO_ENUM[resource.codeGeneratorName] ||
          EnumCodeGenerator.NodeJs,
        link: `${this.clientHost}/${context.workspaceId}/${resource.projectId}/${resource.id}`,
      };
    },
    getServiceModules: async (
      args: functionsArgsTypes.GetServiceModules,
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
      args: functionsArgsTypes.CreateModule,
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
      args: functionsArgsTypes.GetModuleDtosAndEnums,
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
      args: functionsArgsTypes.CreateModuleDto,
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
      args: functionsArgsTypes.CreateModuleEnum,
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
      args: functionsArgsTypes.GetModuleActions,
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
      args: functionsArgsTypes.CreateModuleAction,
      context: AssistantContext,
      loggerContext: MessageLoggerContext
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
      try {
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
      } catch (error) {
        this.logger.warn(
          `Chat: failed to update newly created ModuleAction ${action.id}: ${error.message}. Deleting the action.`,
          error,
          loggerContext
        );
        await this.moduleActionService.delete(
          {
            where: {
              id: action.id,
            },
          },
          context.user
        );
        throw new Error(
          `Failed to create the moduleAction ${name} because of the following error. please fix the error and try again. ${error.message}`
        );
      }
    },
  };
}
