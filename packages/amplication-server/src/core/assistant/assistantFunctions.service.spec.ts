import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { MessageLoggerContext } from "./assistant.service";

import { EnumAssistantFunctions } from "./dto/EnumAssistantFunctions";

import { Env } from "../../env";
import { Account, Entity, Resource } from "../../models";
import { EntityService } from "../entity/entity.service";
import { ModuleService } from "../module/module.service";
import { ModuleActionService } from "../moduleAction/moduleAction.service";
import { ModuleDtoService } from "../moduleDto/moduleDto.service";
import { PluginCatalogService } from "../pluginCatalog/pluginCatalog.service";
import {
  PluginInstallationService,
  REQUIRES_AUTHENTICATION_ENTITY,
} from "../pluginInstallation/pluginInstallation.service";
import { ProjectService } from "../project/project.service";
import { ResourceService } from "../resource/resource.service";
import { AssistantFunctionsService } from "./assistantFunctions.service";
import { AssistantContext } from "./dto/AssistantContext";
import { EnumDataType } from "../../enums/EnumDataType";
import { PermissionsService } from "../permissions/permissions.service";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { Module } from "../module/dto/Module";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { JsonSchemaValidationModule } from "../../services/jsonSchemaValidation.module";
import { USER_ENTITY_NAME } from "../entity/constants";
import { AmplicationError } from "../../errors/AmplicationError";
import { EnumResourceType } from "@amplication/code-gen-types";
import { EnumCodeGenerator } from "../resource/dto/EnumCodeGenerator";
import { BlueprintService } from "../blueprint/blueprint.service";

const EXAMPLE_CHAT_OPENAI_KEY = "EXAMPLE_CHAT_OPENAI_KEY";
const EXAMPLE_WORKSPACE_ID = "EXAMPLE_WORKSPACE_ID";
const EXAMPLE_PROJECT_ID = "EXAMPLE_PROJECT_ID";
const EXAMPLE_RESOURCE_ID = "EXAMPLE_RESOURCE_ID";
const EXAMPLE_THREAD_ID = "EXAMPLE_THREAD_ID";
const EXAMPLE_USER_ID = "EXAMPLE_USER_ID";

const EXAMPLE_ACCOUNT: Account = {
  id: "alice",
  email: "example@amplication.com",
  password: "PASSWORD",
  firstName: "Alice",
  lastName: "Appleseed",
  createdAt: new Date(),
  updatedAt: new Date(),
  githubId: null,
};

const EXAMPLE_ENTITY: Entity = {
  id: "exampleEntityId",
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: "exampleResourceId",
  name: "exampleName",
  displayName: "exampleDisplayName",
  pluralDisplayName: "examplePluralDisplayName",
  customAttributes: "exampleCustomAttributes",
  lockedByUserId: EXAMPLE_USER_ID,
};

const EXAMPLE_ASSISTANT_CONTEXT: AssistantContext = {
  user: {
    workspace: {
      allowLLMFeatures: true,
      id: EXAMPLE_WORKSPACE_ID,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: "",
    },
    id: EXAMPLE_USER_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
    isOwner: true,
    permissions: [],
    account: EXAMPLE_ACCOUNT,
  },
  workspaceId: EXAMPLE_WORKSPACE_ID,
};

const EXAMPLE_MODULE_NAME = "exampleModule";
const EXAMPLE_MODULE_DESCRIPTION = "Example Module Description";
const EXAMPLE_MODULE_ID = "exampleModuleId";

const EXAMPLE_MODULE: Module = {
  id: EXAMPLE_MODULE_ID,
  name: EXAMPLE_MODULE_NAME,
  displayName: EXAMPLE_MODULE_NAME,
  description: EXAMPLE_MODULE_DESCRIPTION,
  enabled: true,
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  parentBlock: null,
  blockType: EnumBlockType.Module,
  inputParameters: null,
  outputParameters: null,
  versionNumber: 0,
};

const EXAMPLE_CALL_ID = "callId";

const EXAMPLE_LOGGER_CONTEXT: MessageLoggerContext = {
  messageContext: {
    workspaceId: EXAMPLE_WORKSPACE_ID,
    projectId: EXAMPLE_PROJECT_ID,
    serviceId: EXAMPLE_RESOURCE_ID,
  },
  threadId: EXAMPLE_THREAD_ID,
  userId: EXAMPLE_USER_ID,
  role: "user",
};

const EXAMPLE_PLUGIN = {
  id: "examplePluginId",
  pluginId: "examplePluginId",
  name: "exampleName",
  description: "exampleDescription",
  repo: "exampleRepo",
  npm: "exampleNpm",
  icon: "exampleIcon",
  github: "exampleGithub",
  website: "exampleWebsite",
  categories: ["exampleCategory1", "exampleCategory2"],
  type: "exampleType",
  taggedVersions: {},
  codeGeneratorName: EnumCodeGenerator.NodeJs,
  versions: [
    {
      id: "exampleVersionId",
      pluginId: "examplePluginId",
      deprecated: false,
      isLatest: true,
      version: "exampleVersion",
      settings: {},
      configurations: {},
    },
  ],
};

const EXAMPLE_RESOURCE: Resource = {
  id: EXAMPLE_RESOURCE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "exampleName",
  codeGeneratorName: "NodeJS",
  description: "",
  resourceType: EnumResourceType.Service,
  gitRepositoryOverride: false,
  licensed: true,
};

const entityServiceCreateOneEntityMock = jest.fn(() => EXAMPLE_ENTITY);
const entityServiceCreateFieldByDisplayNameMock = jest.fn();
const projectServiceCreateProjectMock = jest.fn();
const resourceServiceCreateServiceWithDefaultSettingsMock = jest.fn();
const moduleServiceCreateMock = jest.fn();
const pluginInstallationServiceCreateMock = jest.fn(() => ({
  id: "examplePluginId",
}));
const pluginCatalogServiceGetPluginWithLatestVersionMock = jest.fn(
  () => EXAMPLE_PLUGIN
);

const resourceServiceResourcesMock = jest.fn();
const resourceServiceResourceMock = jest.fn(() => {
  return EXAMPLE_RESOURCE;
});
const moduleServiceFindManyMock = jest.fn(() => {
  return [EXAMPLE_MODULE];
});
const moduleDtoServiceCreateMock = jest.fn(() => {
  return { id: "exampleModuleDtoId" };
});
const moduleDtoServiceCreateEnumMock = jest.fn();
const moduleDtoServiceFindManyMock = jest.fn();

const moduleActionServiceCreateMock = jest.fn();
const projectServiceCommitMock = jest.fn();
const projectServiceGetPendingChangesMock = jest.fn();
const pluginCatalogServiceGetPluginsMock = jest.fn();
const moduleActionServiceFindManyMock = jest.fn();
const entityServiceEntitiesMock = jest.fn();
const entityServiceEntityMock = jest.fn(() => EXAMPLE_ENTITY);
const moduleServiceGetDefaultModuleIdForEntityMock = jest.fn(
  () => EXAMPLE_MODULE_ID
);

const permissionsServiceValidateAccessMock = jest.fn(() => true);

const resourceServiceCreateDefaultAuthEntityMock = jest.fn(
  () => EXAMPLE_ENTITY
);
const resourceServiceGetAuthEntityNameMock = jest.fn(() => USER_ENTITY_NAME);

describe("AssistantFunctionsService", () => {
  let service: AssistantFunctionsService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JsonSchemaValidationModule],
      providers: [
        AssistantFunctionsService,

        {
          provide: ConfigService,
          useValue: {
            get: (variable) => {
              switch (variable) {
                case Env.CHAT_OPENAI_KEY:
                  return EXAMPLE_CHAT_OPENAI_KEY;
                case Env.FEATURE_AI_ASSISTANT_ENABLED:
                  return "true";
                default:
                  return "";
              }
            },
          },
        },
        {
          provide: EntityService,
          useValue: {
            createOneEntity: entityServiceCreateOneEntityMock,
            createFieldByDisplayName: entityServiceCreateFieldByDisplayNameMock,
            entities: entityServiceEntitiesMock,
            entity: entityServiceEntityMock,
            getFields: jest.fn(() => []),
          },
        },
        {
          provide: ResourceService,
          useValue: {
            resource: resourceServiceResourceMock,
            resources: resourceServiceResourcesMock,
            createServiceWithDefaultSettings:
              resourceServiceCreateServiceWithDefaultSettingsMock,
            getAuthEntityName: resourceServiceGetAuthEntityNameMock,
            createDefaultAuthEntity: resourceServiceCreateDefaultAuthEntityMock,
          },
        },
        {
          provide: ModuleService,
          useValue: {
            create: moduleServiceCreateMock,
            findMany: moduleServiceFindManyMock,
            getDefaultModuleIdForEntity:
              moduleServiceGetDefaultModuleIdForEntityMock,
          },
        },
        {
          provide: ProjectService,
          useValue: {
            createProject: projectServiceCreateProjectMock,
            commit: projectServiceCommitMock,
            getPendingChanges: projectServiceGetPendingChangesMock,
          },
        },
        {
          provide: BlueprintService,
          useValue: {},
        },
        {
          provide: PluginCatalogService,
          useValue: {
            getPluginWithLatestVersion:
              pluginCatalogServiceGetPluginWithLatestVersionMock,
            getPlugins: pluginCatalogServiceGetPluginsMock,
          },
        },
        {
          provide: ModuleActionService,
          useValue: {
            create: moduleActionServiceCreateMock,
            findMany: moduleActionServiceFindManyMock,
          },
        },
        {
          provide: ModuleDtoService,
          useValue: {
            create: moduleDtoServiceCreateMock,
            createEnum: moduleDtoServiceCreateEnumMock,
            findMany: moduleDtoServiceFindManyMock,
          },
        },
        {
          provide: PluginInstallationService,
          useValue: {
            create: pluginInstallationServiceCreateMock,
          },
        },
        {
          provide: PermissionsService,
          useValue: {
            validateAccess: permissionsServiceValidateAccessMock,
          },
        },
        MockedAmplicationLoggerProvider,
      ],
    }).compile();

    service = module.get<AssistantFunctionsService>(AssistantFunctionsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  const cases: Array<
    [
      EnumAssistantFunctions,
      { [key: string]: any },
      Array<{ mock: jest.Mock; times: number }>
    ]
  > = [
    [
      EnumAssistantFunctions.CreateEntities,
      {
        names: ["entity 1", "entity 2"],
        serviceId: "value2",
      },
      [
        {
          mock: entityServiceCreateOneEntityMock,
          times: 2,
        },
      ],
    ],
    [
      EnumAssistantFunctions.CreateEntityFields,
      {
        fields: [
          {
            name: "field1",
            type: EnumDataType.SingleLineText,
          },
          {
            name: "field2",
            type: EnumDataType.WholeNumber,
          },
        ],
        entityId: "value2",
      },
      [
        {
          mock: entityServiceCreateFieldByDisplayNameMock,
          times: 2,
        },
      ],
    ],
    [
      EnumAssistantFunctions.CreateProject,
      { projectName: "New Project" },
      [
        {
          mock: projectServiceCreateProjectMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.CreateService,
      {
        serviceName: "New Service",
        projectId: "proj123",
        adminUIPath: "/admin-ui",
        serverPath: "/server",
      },
      [
        {
          mock: resourceServiceCreateServiceWithDefaultSettingsMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.CreateModule,
      {
        moduleName: "New Module",
        moduleDescription: "Module Description",
        serviceId: "service123",
      },
      [
        {
          mock: moduleServiceCreateMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.InstallPlugins,
      {
        pluginIds: ["plugin1", "plugin2"],
        serviceId: "service123",
      },
      [
        {
          mock: pluginCatalogServiceGetPluginWithLatestVersionMock,
          times: 2,
        },
        {
          mock: pluginInstallationServiceCreateMock,
          times: 2,
        },
      ],
    ],
    [
      EnumAssistantFunctions.GetProjectServices,
      { projectId: "proj123" },
      [
        {
          mock: resourceServiceResourcesMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.GetServiceEntities,
      { serviceId: "service123" },
      [
        {
          mock: entityServiceEntitiesMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.CommitProjectPendingChanges,
      { projectId: "proj123", commitMessage: "Initial commit" },
      [
        {
          mock: projectServiceCommitMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.GetProjectPendingChanges,
      { projectId: "proj123" },
      [
        {
          mock: projectServiceGetPendingChangesMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.GetPlugins,
      {
        codeGenerator: EnumCodeGenerator.NodeJs,
      },
      [
        {
          mock: pluginCatalogServiceGetPluginsMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.GetServiceModules,
      { serviceId: "service123" },
      [
        {
          mock: moduleServiceFindManyMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.CreateModuleDto,
      {
        moduleId: "module123",
        serviceId: "service123",
        dtoName: "NewDTO",
        dtoDescription: "DTO Description",
        properties: [],
      },
      [
        {
          mock: moduleDtoServiceCreateMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.CreateModuleEnum,
      {
        moduleId: "module123",
        serviceId: "service123",
        enumName: "NewEnum",
        enumDescription: "Enum Description",
        members: [],
      },
      [
        {
          mock: moduleDtoServiceCreateEnumMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.GetModuleActions,
      {
        moduleId: "module123",
        serviceId: "service123",
      },
      [
        {
          mock: moduleActionServiceFindManyMock,
          times: 1,
        },
      ],
    ],
    [
      EnumAssistantFunctions.CreateModuleAction,
      {
        moduleId: "module123",
        serviceId: "service123",
        actionName: "NewAction",
        actionDescription: "Action Description",
        gqlOperation: "Query",
        restVerb: "Get",
        path: "/new-action",
        inputType: {
          type: "String",
          isArray: false,
        },
        outputType: {
          type: "String",
          isArray: false,
        },
        restInputSource: "Body",
        restInputParamsPropertyName: "params",
        restInputBodyPropertyName: "body",
        restInputQueryPropertyName: "query",
      },
      [
        {
          mock: moduleActionServiceCreateMock,
          times: 1,
        },
      ],
    ],
  ];

  it.each(cases)(
    "should execute function %s correctly",
    async (functionName, params, mocks) => {
      await service.executeFunction(
        EXAMPLE_CALL_ID,
        functionName,
        JSON.stringify(params),
        EXAMPLE_ASSISTANT_CONTEXT,
        EXAMPLE_LOGGER_CONTEXT
      );

      mocks.forEach((mock) => {
        expect(mock.mock).toHaveBeenCalledTimes(mock.times);
      });
    }
  );

  it("should validate permissions before executing a function", async () => {
    const EXAMPLE_SERVICE_ID = "exampleServiceId";

    const functionName = EnumAssistantFunctions.CreateEntities;
    const params = {
      names: ["entity 1", "entity 2"],
      serviceId: EXAMPLE_SERVICE_ID,
    };

    await service.executeFunction(
      EXAMPLE_CALL_ID,
      functionName,
      JSON.stringify(params),
      EXAMPLE_ASSISTANT_CONTEXT,
      EXAMPLE_LOGGER_CONTEXT
    );

    expect(permissionsServiceValidateAccessMock).toHaveBeenCalledTimes(1);
    expect(permissionsServiceValidateAccessMock).toHaveBeenCalledWith(
      EXAMPLE_ASSISTANT_CONTEXT.user,
      AuthorizableOriginParameter.ResourceId,
      EXAMPLE_SERVICE_ID,
      []
    );
  });

  it("should not execute the function without the needed permissions", async () => {
    const EXAMPLE_SERVICE_ID = "exampleServiceId";

    const functionName = EnumAssistantFunctions.CreateEntities;
    const params = {
      names: ["entity 1", "entity 2"],
      serviceId: EXAMPLE_SERVICE_ID,
    };

    permissionsServiceValidateAccessMock.mockReturnValueOnce(false);

    const results = await service.executeFunction(
      EXAMPLE_CALL_ID,
      functionName,
      JSON.stringify(params),
      EXAMPLE_ASSISTANT_CONTEXT,
      EXAMPLE_LOGGER_CONTEXT
    );

    expect(permissionsServiceValidateAccessMock).toHaveBeenCalledTimes(1);

    expect(results).toEqual({
      callId: EXAMPLE_CALL_ID,
      results: "User does not have access to this resource",
    });
  });

  it("should return error for one entity, while creating others successfully ", async () => {
    const EXAMPLE_SERVICE_ID = "exampleServiceId";

    const functionName = EnumAssistantFunctions.CreateEntities;
    const reservedEntityName = "function";
    const params = {
      names: ["entity 1", reservedEntityName, "entity 3"],
      serviceId: EXAMPLE_SERVICE_ID,
    };

    const entityResults = {
      ...EXAMPLE_ENTITY,
      updatedAt: expect.any(String),
      createdAt: expect.any(String),
    };

    const errorMessage = `The name '${reservedEntityName}' is reserved`;

    entityServiceCreateOneEntityMock.mockImplementationOnce(() => {
      return EXAMPLE_ENTITY;
    });
    entityServiceCreateOneEntityMock.mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });
    entityServiceCreateOneEntityMock.mockImplementationOnce(() => {
      return EXAMPLE_ENTITY;
    });

    const functionResults = await service.executeFunction(
      EXAMPLE_CALL_ID,
      functionName,
      JSON.stringify(params),
      EXAMPLE_ASSISTANT_CONTEXT,
      EXAMPLE_LOGGER_CONTEXT
    );

    expect(entityServiceCreateOneEntityMock).toHaveBeenCalledTimes(3);

    const executionResults = JSON.parse(functionResults.results);

    expect(executionResults).toEqual(
      expect.objectContaining({
        allEntitiesErdViewLink: expect.any(String),
        allApisLink: expect.any(String),
        result: [
          expect.objectContaining({
            result: expect.objectContaining({
              entity: expect.objectContaining(entityResults),
              fields: expect.any(Array),
            }),
          }),
          expect.objectContaining({
            error: errorMessage,
          }),
          expect.objectContaining({
            result: expect.objectContaining({
              entity: expect.objectContaining(entityResults),
              fields: expect.any(Array),
            }),
          }),
        ],
      })
    );
  });

  it("should return an error if module DTO types are invalid", async () => {
    const EXAMPLE_SERVICE_ID = "exampleServiceId";

    const functionName = EnumAssistantFunctions.CreateModuleDto;

    const params = {
      moduleId: EXAMPLE_MODULE_ID,
      serviceId: EXAMPLE_SERVICE_ID,
      dtoName: "NewDTO",
      dtoDescription: "DTO Description",
      properties: [
        {
          name: "property1",
          propertyTypes: [
            {
              type: "InvalidType", //this is an invalid type
            },
          ],
          isOptional: false,
          isArray: false,
        },
      ],
    };

    const results = await service.executeFunction(
      EXAMPLE_CALL_ID,
      functionName,
      JSON.stringify(params),
      EXAMPLE_ASSISTANT_CONTEXT,
      EXAMPLE_LOGGER_CONTEXT
    );

    expect(results).toEqual({
      callId: EXAMPLE_CALL_ID,
      results: expect.stringContaining("Invalid arguments:"),
    });
  });

  it("should create auth entity when installing an auth plugin", async () => {
    resourceServiceGetAuthEntityNameMock.mockReturnValueOnce(null);

    pluginCatalogServiceGetPluginWithLatestVersionMock.mockReturnValueOnce({
      ...EXAMPLE_PLUGIN,
      versions: [
        {
          ...EXAMPLE_PLUGIN.versions[0],
          configurations: {
            [REQUIRES_AUTHENTICATION_ENTITY]: "true",
          },
        },
      ],
    });

    await service.installMultiplePlugins(
      ["plugin1", "plugin2", "plugin3"],
      EXAMPLE_RESOURCE_ID,
      EXAMPLE_ASSISTANT_CONTEXT
    );

    expect(resourceServiceGetAuthEntityNameMock).toHaveBeenCalledTimes(1);
    expect(resourceServiceCreateDefaultAuthEntityMock).toHaveBeenCalledTimes(1);
  });

  it.each(["User", "Users", "user", "users"])(
    "should create the default auth entity when creating an entity with the name %s",
    async (name) => {
      const functionName = EnumAssistantFunctions.CreateEntities;
      const params = {
        names: [name],
        serviceId: EXAMPLE_RESOURCE_ID,
      };

      await service.executeFunction(
        EXAMPLE_CALL_ID,
        functionName,
        JSON.stringify(params),
        EXAMPLE_ASSISTANT_CONTEXT,
        EXAMPLE_LOGGER_CONTEXT
      );

      expect(resourceServiceCreateDefaultAuthEntityMock).toHaveBeenCalledTimes(
        1
      );
      expect(entityServiceCreateOneEntityMock).toHaveBeenCalledTimes(0);
    }
  );

  it("should create the regular entity in case the default auth entity already exist when creating an entity with the name user", async () => {
    const functionName = EnumAssistantFunctions.CreateEntities;
    const params = {
      names: ["User"],
      serviceId: EXAMPLE_RESOURCE_ID,
    };

    //throw error from createDefaultAuthEntity
    resourceServiceCreateDefaultAuthEntityMock.mockImplementationOnce(() => {
      throw new AmplicationError("Error");
    });

    await service.executeFunction(
      EXAMPLE_CALL_ID,
      functionName,
      JSON.stringify(params),
      EXAMPLE_ASSISTANT_CONTEXT,
      EXAMPLE_LOGGER_CONTEXT
    );

    expect(resourceServiceCreateDefaultAuthEntityMock).toHaveBeenCalledTimes(1);
    expect(entityServiceCreateOneEntityMock).toHaveBeenCalledTimes(1);
  });
});
