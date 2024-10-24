import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { Test, TestingModule } from "@nestjs/testing";
import { Resource } from "../../models";
import { PrismaService } from "../../prisma/prisma.service";
import { EnumResourceType } from "../resource/dto/EnumResourceType";
import { ResourceService } from "../resource/resource.service";
import { OutdatedVersionAlertService } from "./outdatedVersionAlert.service";
import { PluginInstallationService } from "../pluginInstallation/pluginInstallation.service";
import { ServiceTemplateVersion } from "../serviceSettings/dto/ServiceTemplateVersion";
import { EnumOutdatedVersionAlertType } from "./dto/EnumOutdatedVersionAlertType";
import { EnumOutdatedVersionAlertStatus } from "./dto/EnumOutdatedVersionAlertStatus";

const EXAMPLE_RESOURCE_ID = "EXAMPLE_RESOURCE_ID";
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
};

const resourceServiceResourcesMock = jest.fn(() => [EXAMPLE_RESOURCE]);
const resourceServiceResourceMock = jest.fn(() => {
  return EXAMPLE_RESOURCE;
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
const prismaServiceOutdatedVersionAlertCreateMock = jest.fn();

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
          },
        },
        {
          provide: PluginInstallationService,
          useValue: {
            create: jest.fn(),
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
          id: EXAMPLE_RESOURCE.projectId,
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
      1
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
