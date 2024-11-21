import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { Test, TestingModule } from "@nestjs/testing";
import { Project, Resource, User, Workspace } from "../../models";
import { PrismaService } from "../../prisma/prisma.service";
import { EnumResourceType } from "../resource/dto/EnumResourceType";
import { ResourceService } from "../resource/resource.service";
import { OutdatedVersionAlertService } from "./outdatedVersionAlert.service";
import { PluginInstallationService } from "../pluginInstallation/pluginInstallation.service";
import { ServiceTemplateVersion } from "../serviceSettings/dto/ServiceTemplateVersion";
import { EnumOutdatedVersionAlertType } from "./dto/EnumOutdatedVersionAlertType";
import { EnumOutdatedVersionAlertStatus } from "./dto/EnumOutdatedVersionAlertStatus";
import { ProjectService } from "../project/project.service";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { ConfigService } from "@nestjs/config";
import { OutdatedVersionAlert } from "./dto/OutdatedVersionAlert";
import { TechDebt } from "@amplication/schema-registry";
import { WorkspaceService } from "../workspace/workspace.service";

const EXAMPLE_RESOURCE_ID = "EXAMPLE_RESOURCE_ID";
const EXAMPLE_WORKSPACE_ID = "EXAMPLE_WORKSPACE_ID";
const EXAMPLE_TEMPLATE_RESOURCE_ID = "EXAMPLE_TEMPLATE_RESOURCE_ID";

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
  projectId: "exampleProjectId",
  project: {
    id: "exampleProjectId",
    name: "exampleProject",
    createdAt: new Date(),
    updatedAt: new Date(),
    useDemoRepo: false,
    licensed: false,
  },
};

const EXAMPLE_PROJECT: Project = {
  id: "ExampleProjectId",
  name: "ExampleProjectName",
  createdAt: new Date(),
  updatedAt: new Date(),
  useDemoRepo: false,
  licensed: false,
  workspaceId: EXAMPLE_WORKSPACE_ID,
};

const EXAMPLE_ALERT: OutdatedVersionAlert = {
  id: "ExampleAlertId",
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: "ExampleResourceId",
  type: "TemplateVersion",
  outdatedVersion: "",
  latestVersion: "",
  status: "Canceled",
  resource: EXAMPLE_RESOURCE,
};

const EXAMPLE_USERS: User[] = [
  {
    id: "ExampleUserId",
    createdAt: new Date(),
    updatedAt: new Date(),
    isOwner: false,
  },
  {
    id: "ExampleUserId2",
    createdAt: new Date(),
    updatedAt: new Date(),
    isOwner: true,
  },
];

const EXAMPLE_WORKSPACE: Workspace = {
  id: "ExampleWorkspaceId",
  name: "ExampleWorkspaceName",
  createdAt: new Date(),
  updatedAt: new Date(),
  allowLLMFeatures: false,
};

const resourceServiceResourcesMock = jest.fn(() => [EXAMPLE_RESOURCE]);

const resourceServiceResourceMock = jest.fn(() => {
  return EXAMPLE_RESOURCE;
});

const projectServiceProjectMock = jest.fn(() => {
  return EXAMPLE_PROJECT;
});

const workspaceServiceUsersMock = jest.fn(() => {
  return EXAMPLE_USERS;
});

const resourceServiceGetServiceTemplateSettingsMock = jest.fn(
  (): ServiceTemplateVersion => {
    return {
      serviceTemplateId: EXAMPLE_TEMPLATE_RESOURCE_ID,
      version: "1.0.0",
    };
  }
);

const prismaServiceOutdatedVersionAlertUpdateManyMock = jest.fn();
const prismaServiceOutdatedVersionAlertCreateMock = jest.fn(() => {
  return EXAMPLE_ALERT;
});

const mockServiceEmitMessage = jest
  .fn()
  .mockImplementation((topic: string, message: TechDebt.KafkaEvent) =>
    Promise.resolve()
  );

describe("OutdatedVersionAlertService", () => {
  let service: OutdatedVersionAlertService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => ({
            outdatedVersionAlert: {
              updateMany: prismaServiceOutdatedVersionAlertUpdateManyMock,
              create: prismaServiceOutdatedVersionAlertCreateMock,
              findFirst: prismaServiceOutdatedVersionAlertCreateMock,
            },
          })),
        },
        {
          provide: ResourceService,
          useValue: {
            resource: resourceServiceResourceMock,
            resources: resourceServiceResourcesMock,
            getServiceTemplateSettings:
              resourceServiceGetServiceTemplateSettingsMock,
            getResourceWorkspace: jest.fn(() => {
              return EXAMPLE_WORKSPACE;
            }),
          },
        },
        {
          provide: KafkaProducerService,
          useValue: {
            emitMessage: mockServiceEmitMessage,
          },
        },
        {
          provide: ProjectService,
          useValue: {
            findFirst: projectServiceProjectMock,
            findUnique: projectServiceProjectMock,
          },
        },
        {
          provide: PluginInstallationService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: WorkspaceService,
          useValue: {
            findWorkspaceUsers: workspaceServiceUsersMock,
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        MockedAmplicationLoggerProvider,

        OutdatedVersionAlertService,
      ],
    }).compile();

    service = module.get<OutdatedVersionAlertService>(
      OutdatedVersionAlertService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should throw an exception when the provided resource is not a template", async () => {
    const templateResourceId = EXAMPLE_RESOURCE_ID;
    const outdatedVersion = "1.0.0";
    const latestVersion = "2.0.0";

    resourceServiceResourceMock.mockReturnValueOnce({
      ...EXAMPLE_RESOURCE,
      resourceType: EnumResourceType.Service,
    });

    await expect(
      service.triggerAlertsForTemplateVersion(
        templateResourceId,
        outdatedVersion,
        latestVersion
      )
    ).rejects.toThrow(
      `Cannot trigger alerts. Resource with id ${templateResourceId} is not a template`
    );
  });

  it("should throw an exception when the provided resource cannot be found", async () => {
    const templateResourceId = EXAMPLE_RESOURCE_ID;
    const outdatedVersion = "1.0.0";
    const latestVersion = "2.0.0";

    resourceServiceResourceMock.mockReturnValueOnce(null);

    await expect(
      service.triggerAlertsForTemplateVersion(
        templateResourceId,
        outdatedVersion,
        latestVersion
      )
    ).rejects.toThrow(
      `Cannot trigger alerts. Template with id ${templateResourceId} not found`
    );
  });

  it("should trigger alerts for template version", async () => {
    const templateResourceId = EXAMPLE_TEMPLATE_RESOURCE_ID;
    const outdatedVersion = "1.0.0";
    const latestVersion = "2.0.0";

    resourceServiceResourceMock.mockReturnValueOnce({
      ...EXAMPLE_RESOURCE,
      resourceType: EnumResourceType.ServiceTemplate,
    });

    await service.triggerAlertsForTemplateVersion(
      templateResourceId,
      outdatedVersion,
      latestVersion
    );

    expect(resourceServiceResourceMock).toHaveBeenCalledTimes(1);
    expect(resourceServiceResourceMock).toHaveBeenCalledWith({
      where: {
        id: EXAMPLE_TEMPLATE_RESOURCE_ID,
      },
    });

    expect(resourceServiceResourcesMock).toHaveBeenCalledTimes(1);
    expect(resourceServiceResourcesMock).toHaveBeenCalledWith({
      where: {
        serviceTemplateId: EXAMPLE_TEMPLATE_RESOURCE_ID,
        project: {
          workspace: {
            id: EXAMPLE_WORKSPACE_ID,
          },
        },
      },
    });

    expect(resourceServiceGetServiceTemplateSettingsMock).toHaveBeenCalledTimes(
      1
    );
    expect(resourceServiceGetServiceTemplateSettingsMock).toHaveBeenCalledWith(
      EXAMPLE_RESOURCE_ID,
      null
    );

    expect(
      prismaServiceOutdatedVersionAlertUpdateManyMock
    ).toHaveBeenCalledTimes(1);
    expect(
      prismaServiceOutdatedVersionAlertUpdateManyMock
    ).toHaveBeenCalledWith({
      where: {
        resourceId: EXAMPLE_RESOURCE_ID,
        type: EnumOutdatedVersionAlertType.TemplateVersion,
        status: EnumOutdatedVersionAlertStatus.New,
      },
      data: {
        status: EnumOutdatedVersionAlertStatus.Canceled,
      },
    });

    expect(prismaServiceOutdatedVersionAlertCreateMock).toHaveBeenCalledTimes(
      2
    );
    expect(prismaServiceOutdatedVersionAlertCreateMock).toHaveBeenCalledWith({
      data: {
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID,
          },
        },
        status: EnumOutdatedVersionAlertStatus.New,
        type: EnumOutdatedVersionAlertType.TemplateVersion,
        outdatedVersion: "1.0.0",
        latestVersion: "2.0.0",
      },
    });
  });
});
