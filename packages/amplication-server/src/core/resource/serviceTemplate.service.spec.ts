import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Test, TestingModule } from "@nestjs/testing";
import { Resource, User } from "../../models";
import { PrismaService } from "../../prisma";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { OutdatedVersionAlertService } from "../outdatedVersionAlert/outdatedVersionAlert.service";
import { PluginInstallationService } from "../pluginInstallation/pluginInstallation.service";
import { ProjectService } from "../project/project.service";
import { ResourceSettingsService } from "../resourceSettings/resourceSettings.service";
import { ResourceVersion } from "../resourceVersion/dto/ResourceVersion";
import { ResourceVersionService } from "../resourceVersion/resourceVersion.service";
import { EnumAuthProviderType } from "../serviceSettings/dto/EnumAuthenticationProviderType";
import { ServiceSettingsService } from "../serviceSettings/serviceSettings.service";
import { CreateServiceTemplateArgs } from "./dto/CreateServiceTemplateArgs";
import { CreateTemplateFromResourceArgs } from "./dto/CreateTemplateFromResourceArgs";
import { EnumResourceType } from "./dto/EnumResourceType";
import { ResourceService } from "./resource.service";
import { ServiceTemplateService } from "./serviceTemplate.service";
import { ResourceTemplateVersionService } from "../resourceTemplateVersion/resourceTemplateVersion.service";
import { EnumBlockType } from "../../enums/EnumBlockType";

const EXAMPLE_RESOURCE_ID = "EXAMPLE_RESOURCE_ID";
const EXAMPLE_USER_ID = "EXAMPLE_USER_ID";

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

const EXAMPLE_RESOURCE_VERSION: ResourceVersion = {
  id: "EXAMPLE_RESOURCE_VERSION_ID",
  createdAt: new Date(),
  version: "1.0.0",
  resource: EXAMPLE_RESOURCE,
  resourceId: EXAMPLE_RESOURCE_ID,
  userId: EXAMPLE_USER_ID,
  commitId: "exampleCommitId",
};

const EXAMPLE_PLUGIN = {
  id: "clb3p3uxx009bjn01zfbim7p1",
  displayName: "jwtAuth",
  npm: "@amplication/plugin-auth-jwt",
  enabled: true,
  version: "latest",
  pluginId: "auth-jwt",
  settings: {},
  configurations: {},
  isPrivate: false,
  resource: { connect: { id: "" } },
};

const EXAMPLE_USER: User = {
  id: "userId",
  workspace: { id: "workspaceId" },
} as User;

const prismaServiceMock = {
  resource: {
    findMany: jest.fn(async () => [EXAMPLE_RESOURCE]),
    create: jest.fn(async () => EXAMPLE_RESOURCE),
    findUnique: jest.fn(async () => EXAMPLE_RESOURCE),
  },
  resourceVersion: {
    findUnique: jest.fn(async () => EXAMPLE_RESOURCE_VERSION),
  },
  project: {},
  serviceSettings: {},
  resourceSettings: {},
  pluginInstallation: {},
  outdatedVersionAlert: {},
};

const pluginInstallationServiceMock = {
  findMany: jest.fn(async () => [EXAMPLE_PLUGIN] as any),
  create: jest.fn(),
};

const analyticsServiceMock = {
  trackWithContext: jest.fn(() => {
    return null;
  }),
};

const serviceSettingsServiceMock = {
  updateServiceTemplateVersion: jest.fn(),
  getServiceTemplateSettings: jest.fn(),
  updateServiceSettings: jest.fn(),
  getServiceSettingsValues: jest.fn(() => {
    return {
      blockType: EnumBlockType.ServiceSettings,
      description: "Default service settings",
      displayName: "Service Settings",
      authProvider: EnumAuthProviderType.Jwt,
      serverSettings: {
        generateGraphQL: true,
        generateRestApi: true,
        generateServer: true,
        serverPath: "apps/service-name",
      },
      adminUISettings: {
        generateAdminUI: true,
        adminUIPath: "apps/service-name-admin",
      },
    };
  }),
};

const resourceSettingsServiceMock = {};

const resourceServiceMock = {
  createResource: jest.fn(async () => EXAMPLE_RESOURCE),
  createServiceDefaultObjects: jest.fn(),
  installPlugins: jest.fn(),
  resource: jest.fn(async () => EXAMPLE_RESOURCE),
  getServiceTemplateSettings: jest.fn(),
};

const resourceVersionServiceMock = {
  getLatest: jest.fn(async () => EXAMPLE_RESOURCE_VERSION),
  compareResourceVersions: jest.fn(),
};

const outdatedVersionAlertServiceMock = {
  resolvesServiceTemplateUpdated: jest.fn(),
};

const projectServiceMock = {
  findProjects: jest.fn(async () => [{ id: "publicProjectId" }]),
};

const amplicationLoggerMock = {
  info: jest.fn(),
  error: jest.fn(),
};

describe("ServiceTemplateService", () => {
  let service: ServiceTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceTemplateService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
        {
          provide: PluginInstallationService,
          useValue: pluginInstallationServiceMock,
        },
        {
          provide: SegmentAnalyticsService,
          useValue: analyticsServiceMock,
        },
        {
          provide: ServiceSettingsService,
          useValue: serviceSettingsServiceMock,
        },
        {
          provide: ResourceSettingsService,
          useValue: resourceSettingsServiceMock,
        },
        {
          provide: AmplicationLogger,
          useValue: amplicationLoggerMock,
        },
        {
          provide: ResourceService,
          useValue: resourceServiceMock,
        },
        {
          provide: ResourceVersionService,
          useValue: resourceVersionServiceMock,
        },
        {
          provide: OutdatedVersionAlertService,
          useValue: outdatedVersionAlertServiceMock,
        },
        {
          provide: ResourceTemplateVersionService,
          useValue: {},
        },
        {
          provide: ProjectService,
          useValue: projectServiceMock,
        },
      ],
    }).compile();

    service = module.get<ServiceTemplateService>(ServiceTemplateService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createServiceTemplate", () => {
    it("should create a service template", async () => {
      const args: CreateServiceTemplateArgs = {
        data: {
          resource: {
            name: "Test Service",
            description: "Test Description",
            project: { connect: { id: "projectId" } },
            resourceType: EnumResourceType.ServiceTemplate,
            serviceSettings: {
              authProvider: EnumAuthProviderType.Auth0,
              adminUISettings: {},
              serverSettings: {},
            },
            blueprint: {
              connect: { id: "blueprintId" },
            },
          },
          plugins: {
            plugins: [EXAMPLE_PLUGIN],
          },
        },
      };

      const result = await service.createServiceTemplate(args, EXAMPLE_USER);

      expect(result).toEqual(EXAMPLE_RESOURCE);
      expect(resourceServiceMock.createResource).toHaveBeenCalledWith(
        {
          data: {
            name: "Test Service",
            description: "Test Description",
            project: { connect: { id: "projectId" } },
            blueprint: {
              connect: { id: "blueprintId" },
            },
            resourceType: EnumResourceType.ServiceTemplate,
          },
        },
        EXAMPLE_USER
      );
      expect(
        resourceServiceMock.createServiceDefaultObjects
      ).toHaveBeenCalledWith(EXAMPLE_RESOURCE, EXAMPLE_USER, false, {
        authProvider: EnumAuthProviderType.Auth0,
        adminUISettings: {},
        serverSettings: {},
      });
      expect(resourceServiceMock.installPlugins).toHaveBeenCalledWith(
        EXAMPLE_RESOURCE_ID,
        [
          {
            ...EXAMPLE_PLUGIN,
            resource: { connect: { id: "" } },
          },
        ],
        EXAMPLE_USER
      );
    });
  });

  describe("createTemplateFromExistingResource", () => {
    it("should create a template from an existing resource", async () => {
      resourceServiceMock.resource.mockResolvedValueOnce({
        ...EXAMPLE_RESOURCE,
        blueprintId: "blueprintId",
        codeGeneratorName: "Blueprint",
        projectId: "projectId",
      });

      resourceServiceMock.createResource.mockResolvedValueOnce({
        ...EXAMPLE_RESOURCE,
        blueprintId: "blueprintId",
        codeGeneratorName: "Blueprint",
        projectId: "projectId",
      });

      const args: CreateTemplateFromResourceArgs = {
        data: {
          resource: { id: "resourceId" },
        },
      };
      const user: User = {
        id: "userId",
        workspace: { id: "workspaceId" },
      } as User;

      const result = await service.createTemplateFromExistingResource(
        args,
        user
      );

      expect(result).toEqual({
        ...EXAMPLE_RESOURCE,
        blueprintId: "blueprintId",
        codeGeneratorName: "Blueprint",
        projectId: "projectId",
      });
      expect(resourceServiceMock.resource).toHaveBeenCalledWith({
        where: { id: "resourceId" },
      });
      expect(resourceServiceMock.createResource).toHaveBeenCalledWith(
        {
          data: {
            name: "exampleName-template",
            description: "Template created from an existing resource",
            project: { connect: { id: "projectId" } },
            resourceType: EnumResourceType.ServiceTemplate,
            codeGenerator: "Blueprint",
            blueprint: { connect: { id: "blueprintId" } },
          },
        },
        user
      );
    });

    it("should throw an error if resource not found", async () => {
      const args: CreateTemplateFromResourceArgs = {
        data: {
          resource: { id: "resourceId" },
        },
      };

      resourceServiceMock.resource.mockResolvedValueOnce(null);

      await expect(
        service.createTemplateFromExistingResource(args, EXAMPLE_USER)
      ).rejects.toThrow(`Resource with id resourceId not found`);
    });

    it("should throw an error if resource has no blueprint", async () => {
      const args: CreateTemplateFromResourceArgs = {
        data: {
          resource: { id: "resourceId" },
        },
      };

      resourceServiceMock.resource.mockResolvedValueOnce({
        ...EXAMPLE_RESOURCE,
        blueprintId: null,
      });

      await expect(
        service.createTemplateFromExistingResource(args, EXAMPLE_USER)
      ).rejects.toThrow(`This method only support resources with a blueprint`);
    });
  });
});
