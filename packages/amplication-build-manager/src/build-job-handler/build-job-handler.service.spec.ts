import { DSGResourceData } from "@amplication/code-gen-types";
import {
  CodeGeneratorVersionStrategy,
  EnumAuthProviderType,
  EnumDataType,
  EnumEntityAction,
  EnumEntityPermissionType,
} from "@amplication/code-gen-types";
import { Test, TestingModule } from "@nestjs/testing";
import { BuildJobsHandlerService } from "./build-job-handler.service";
import { BuildId, EnumDomainName, EnumJobStatus, JobBuildId } from "../types";
import { RedisService } from "../redis/redis.service";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { CodeGeneratorService } from "../code-generator/code-generator-catalog.service";
import { Env } from "../env";
import { ConfigService } from "@nestjs/config";

const adminAndServerInputJson: DSGResourceData = {
  entities: [
    {
      id: "aed41776-99ca-4674-b26d-0458fd440875",
      name: "User",
      displayName: "User",
      pluralDisplayName: "Users",
      pluralName: "users",
      customAttributes:
        '@@index([name, email]) @@unique([name(sort: Desc), email]) @@map("users")',
      fields: [
        {
          id: "053e75d0-9f02-4182-8f61-46fbdbaa71bd",
          permanentId: "053e75d0-9f02-4182-8f61-46fbdbaa71b1",
          name: "id",
          displayName: "Id",
          dataType: EnumDataType.Id,
          properties: {
            idType: "CUID",
          },
          required: true,
          unique: false,
          searchable: true,
        },
        {
          id: "a4e0c058-5768-4481-9da9-e48c73ab224d",
          permanentId: "a4e0c058-5768-4481-9da9-e48c73ab2241",
          name: "name",
          displayName: "Name",
          required: true,
          unique: false,
          searchable: true,
          dataType: EnumDataType.SingleLineText,
          customAttributes: '@unique @map("name")',
        },
        {
          id: "e3fa6ddd-ad36-48ce-8042-9c0aa576e5a9",
          permanentId: "e3fa6ddd-ad36-48ce-8042-9c0aa576e5a1",
          name: "bio",
          displayName: "Bio",
          required: true,
          unique: false,
          searchable: true,
          dataType: EnumDataType.MultiLineText,
        },
        {
          id: "8c5c4130-94b0-4ce4-a4cb-4e42bf7a9b37",
          permanentId: "8c5c4130-94b0-4ce4-a4cb-4e42bf7a9b31",
          name: "email",
          displayName: "Email",
          required: true,
          unique: true,
          searchable: true,
          dataType: EnumDataType.Email,
        },
        {
          id: "71ba3f5e-7324-4ace-af95-d4bcea8f8368",
          permanentId: "71ba3f5e-7324-4ace-af95-d4bcea8f8361",
          name: "age",
          displayName: "Age",
          required: true,
          unique: false,
          searchable: true,
          dataType: EnumDataType.WholeNumber,
          properties: {
            minimumValue: 0,
            maximumValue: 120,
          },
        },
        {
          id: "b491038d-f588-45e3-b97f-9074f3ed8c83",
          permanentId: "b491038d-f588-45e3-b97f-9074f3ed8c81",
          name: "birthDate",
          displayName: "Birth Date",
          required: true,
          unique: false,
          searchable: true,
          dataType: EnumDataType.DateTime,
          properties: {
            dataOnly: false,
          },
        },
        {
          id: "9fa9604e-f9ab-45fb-b8bd-557ae10eda8c",
          permanentId: "9fa9604e-f9ab-45fb-b8bd-557ae10eda81",
          name: "score",
          displayName: "Score",
          required: true,
          unique: false,
          searchable: false,
          dataType: EnumDataType.DecimalNumber,
          properties: {
            minimumValue: 1,
            maximumValue: 999,
            precision: 2,
          },
        },
        {
          id: "a7b32c49-e73d-4b6f-9efb-fcb77e60b303",
          permanentId: "9bb55fcc-1c3a-4b99-8bcf-6ea85d052c3d",
          name: "manager",
          displayName: "Manager",
          required: false,
          unique: false,
          searchable: true,
          dataType: EnumDataType.Lookup,
          properties: {
            relatedEntityId: "aed41776-99ca-4674-b26d-0458fd440875",
            relatedFieldId: "7bb3d5c1-f5b9-4fa4-8087-87f0c549d5f2",
            allowMultipleSelection: false,
          },
        },
        {
          id: "3787591a-333b-45c5-9e9d-362d9697bb38",
          permanentId: "7bb3d5c1-f5b9-4fa4-8087-87f0c549d5f2",
          name: "employees",
          displayName: "Employees",
          required: false,
          unique: false,
          searchable: false,
          dataType: EnumDataType.Lookup,
          properties: {
            relatedEntityId: "aed41776-99ca-4674-b26d-0458fd440875",
            relatedFieldId: "9bb55fcc-1c3a-4b99-8bcf-6ea85d052c3d",
            allowMultipleSelection: true,
          },
        },
        {
          id: "9fa9604e-f9ab-45fb-b8bd-557ae1011111",
          permanentId: "ae21f2fb-9174-49de-9576-632d859a5dd1",
          name: "organizations",
          displayName: "Organizations",
          required: false,
          unique: false,
          searchable: true,
          dataType: EnumDataType.Lookup,
          properties: {
            relatedEntityId: "3426e3f7-c316-416e-b7a1-d2a1bce17a4",
            relatedFieldId: "3c5f6e76-a124-4f9a-a944-c75f55495859",
            allowMultipleSelection: true,
          },
        },
        {
          id: "1a34cc0e-91dd-4ef2-b8eb-df5a44154a21",
          permanentId: "1a34cc0e-91dd-4ef2-b8eb-df5a44154a22",
          name: "interests",
          displayName: "Interests",
          required: true,
          unique: false,
          searchable: true,
          dataType: EnumDataType.MultiSelectOptionSet,
          properties: {
            options: [
              {
                label: "Programming",
                value: "programming",
              },
              {
                label: "Design",
                value: "design",
              },
            ],
          },
        },
        {
          id: "daa757a6-4e15-4afc-a6e3-d4366d64367a",
          permanentId: "daa757a6-4e15-4afc-a6e3-d4366d643671",
          name: "priority",
          displayName: "Priority",
          required: true,
          unique: false,
          searchable: true,
          dataType: EnumDataType.OptionSet,
          properties: {
            options: [
              {
                label: "High",
                value: "high",
              },
              {
                label: "Medium",
                value: "medium",
              },
              {
                label: "Low",
                value: "low",
              },
            ],
          },
        },
        {
          id: "e88e745f-e4a0-414a-b43d-99d7728d1207",
          permanentId: "e88e745f-e4a0-414a-b43d-99d7728d1201",
          name: "isCurious",
          displayName: "Is Curious",
          required: true,
          unique: false,
          searchable: true,
          dataType: EnumDataType.Boolean,
        },
        {
          id: "e8b7aca3-e761-4d0c-9196-b983d63ae80d",
          permanentId: "e8b7aca3-e761-4d0c-9196-b983d63ae801",
          name: "location",
          displayName: "Location",
          required: true,
          unique: false,
          searchable: true,
          dataType: EnumDataType.GeographicLocation,
        },
        {
          id: "e8b7aca3-e761-4d0c-9196-b983d63ae755",
          permanentId: "e8b7aca3-e761-4d0c-9196-b983d63ae755",
          name: "extendedProperties",
          displayName: "Extended Properties",
          required: true,
          unique: false,
          searchable: true,
          dataType: EnumDataType.Json,
        },
        {
          id: "b227bd7a-2fe5-47f8-8f3e-29a2c26111b7",
          permanentId: "118e407b-30f7-48da-af9c-de1393548b4c",
          name: "profile",
          displayName: "Profile",
          dataType: EnumDataType.Lookup,
          properties: {
            relatedEntityId: "f36aa4e3-d275-41d0-843a-876ec66bc2f7",
            relatedFieldId: "42d31012-6164-472a-92d0-a8f5dc0486d4",
            allowMultipleSelection: false,
          },
          required: false,
          unique: false,
          searchable: true,
        },
      ],
      permissions: [
        {
          action: EnumEntityAction.Create,
          permissionFields: [],
          permissionRoles: [],
          type: EnumEntityPermissionType.AllRoles,
        },
        {
          action: EnumEntityAction.Delete,
          permissionFields: [],
          permissionRoles: [],
          type: EnumEntityPermissionType.AllRoles,
        },
        {
          action: EnumEntityAction.Search,
          permissionFields: [],
          permissionRoles: [],
          type: EnumEntityPermissionType.AllRoles,
        },
        {
          action: EnumEntityAction.Update,
          permissionFields: [],
          permissionRoles: [],
          type: EnumEntityPermissionType.AllRoles,
        },
        {
          action: EnumEntityAction.View,
          permissionFields: [],
          permissionRoles: [],
          type: EnumEntityPermissionType.AllRoles,
        },
      ],
    },
  ],
  roles: [
    {
      // id: "4da76cb1-46d0-4fd0-b81b-930c0ae5ec40",
      // createdAt: "2023-10-09T10:58:10.568Z",
      // updatedAt: "2023-10-09T10:58:10.568Z",
      displayName: "User",
      name: "user",
    },
    {
      // id: "4da76cb1-46d0-4fd0-b81b-930c0ae5ec41",
      // createdAt: "2023-10-09T10:58:10.568Z",
      // updatedAt: "2023-10-09T10:58:10.568Z",
      displayName: "Admin",
      name: "admin",
    },
    {
      // id: "4da76cb1-46d0-4fd0-b81b-930c0ae5ec42",
      // createdAt: "2023-10-09T10:58:10.568Z",
      // updatedAt: "2023-10-09T10:58:10.568Z",
      displayName: "Area Manager",
      name: "areaManager",
    },
  ],
  buildId: "cloo1bi5t0001p5888jj5wle9",
  resourceInfo: {
    name: "Sample Application",
    description: "Sample application for testing",
    version: "0.1.3",
    id: "ckl0ow1xj00763cjnch10k6mc",
    url: "https://app.amplication.com/ckl0ow1xj00763cjnch10k6mc",
    settings: {
      authProvider: EnumAuthProviderType.Http,
      authEntityName: "User",
      serverSettings: {
        generateGraphQL: true,
        generateRestApi: true,
        generateServer: true,
        serverPath: "",
      },
      adminUISettings: {
        generateAdminUI: true,
        adminUIPath: "",
      },
    },
    codeGeneratorVersionOptions: {
      codeGeneratorVersion: null,
      codeGeneratorStrategy: CodeGeneratorVersionStrategy.LatestMajor,
    },
  },
  resourceType: "Service",
  pluginInstallations: [
    {
      id: "clb3p3ov800cplc01a8f6uwje",
      npm: "@amplication/plugin-db-postgres",
      enabled: true,
      version: "latest",
      pluginId: "db-postgres",
      settings: {
        host: "localhost",
        port: 5432,
        user: "admin",
        password: "admin",
        dbName: "my-db",
        enableLogging: true,
      },
    },
  ],
};

const onlyServerInputJson: DSGResourceData = {
  ...adminAndServerInputJson,
  resourceInfo: {
    ...adminAndServerInputJson.resourceInfo,
    settings: {
      ...adminAndServerInputJson.resourceInfo.settings,
      adminUISettings: {
        ...adminAndServerInputJson.resourceInfo.settings.adminUISettings,
        generateAdminUI: false,
      },
    },
  },
};

const onlyAdminInputJson: DSGResourceData = {
  ...adminAndServerInputJson,
  resourceInfo: {
    ...adminAndServerInputJson.resourceInfo,
    settings: {
      ...adminAndServerInputJson.resourceInfo.settings,
      serverSettings: {
        ...adminAndServerInputJson.resourceInfo.settings.serverSettings,
        generateServer: false,
      },
    },
  },
};

const buildId = "cloo1bi5t0001p5888jj5wle9";

describe("BuildJobsHandlerService", () => {
  let service: BuildJobsHandlerService;
  let redisService: RedisService;
  const mockCodeGeneratorServiceCompareVersions = jest.fn();
  const mockRedisSet = jest.fn();
  const mockOnRedisGet = jest.fn();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MockedAmplicationLoggerProvider,
        {
          provide: RedisService,
          useValue: {
            get: mockOnRedisGet,
            set: mockRedisSet,
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: (variable) => {
              switch (variable) {
                case Env.FEATURE_SPLIT_JOBS_MIN_DSG_VERSION:
                  return "v2.0.0";
                default:
                  return "";
              }
            },
          },
        },
        {
          provide: CodeGeneratorService,
          useValue: {
            getCodeGeneratorVersion: jest.fn(),
            compareVersions: mockCodeGeneratorServiceCompareVersions,
          },
        },
        BuildJobsHandlerService,
      ],
    }).compile();

    service = module.get<BuildJobsHandlerService>(BuildJobsHandlerService);
    redisService = module.get<RedisService>(RedisService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("extractBuildId", () => {
    it("should extract build id from jobBuildId", () => {
      const jobBuildId = `${buildId}-${EnumDomainName.AdminUI}`;
      expect(service.extractBuildId(jobBuildId)).toBe(buildId);
    });

    it("should return the same input when the buildId doesn't contain a domain name", () => {
      const jobBuildId = `${buildId}`;
      expect(service.extractBuildId(jobBuildId)).toBe(buildId);
    });
  });

  describe("splitBuildsIntoJobs", () => {
    describe("when the code generator version is greater than the min version to split builds", () => {
      beforeEach(() => {
        mockCodeGeneratorServiceCompareVersions.mockReturnValueOnce(1);
      });

      it("should create two requests to start two jobs, one for admin by passing onlyAdminInputJson and one for server by passing onlyServerInputJson", async () => {
        const spyOnSetJobStatus = jest.spyOn(service, "setJobStatus");
        const adminJobBuildId = `${buildId}-${EnumDomainName.AdminUI}`;
        const serverJobBuildId = `${buildId}-${EnumDomainName.Server}`;

        const jobs = await service.splitBuildsIntoJobs(
          adminAndServerInputJson,
          buildId,
          "0.1.3"
        );
        expect(jobs.length).toBe(2);
        expect(jobs).toEqual([
          [serverJobBuildId, onlyServerInputJson],
          [adminJobBuildId, onlyAdminInputJson],
        ]);

        expect(
          jobs[0][1].resourceInfo.settings.adminUISettings.generateAdminUI
        ).toBe(false);

        expect(
          jobs[1][1].resourceInfo.settings.serverSettings.generateServer
        ).toBe(false);

        expect(spyOnSetJobStatus).toBeCalledTimes(2);
      });

      it("should build only server, it will create one request to start a jobs with onlyServerInputJson", async () => {
        const spyOnSetJobStatus = jest.spyOn(service, "setJobStatus");
        const serverJobBuildId = `${buildId}-${EnumDomainName.Server}`;

        const jobs = await service.splitBuildsIntoJobs(
          onlyServerInputJson,
          buildId,
          "0.1.3"
        );
        expect(jobs.length).toBe(1);
        expect(jobs).toEqual([[serverJobBuildId, onlyServerInputJson]]);

        expect(spyOnSetJobStatus).toHaveBeenCalledWith(
          serverJobBuildId,
          EnumJobStatus.InProgress
        );
        expect(spyOnSetJobStatus).toBeCalledTimes(1);
      });

      it("should build only admin, it will create one request to start a jobs with onlyAdminInputJson", async () => {
        const spyOnSetJobStatus = jest.spyOn(service, "setJobStatus");
        const adminJobBuildId = `${buildId}-${EnumDomainName.AdminUI}`;

        const jobs = await service.splitBuildsIntoJobs(
          onlyAdminInputJson,
          buildId,
          "0.1.3"
        );
        expect(jobs.length).toBe(1);
        expect(jobs).toEqual([[adminJobBuildId, onlyAdminInputJson]]);

        expect(spyOnSetJobStatus).toHaveBeenCalledWith(
          adminJobBuildId,
          EnumJobStatus.InProgress
        );
        expect(spyOnSetJobStatus).toBeCalledTimes(1);
      });
    });

    describe("when the code generator version is lower than the min version to split builds", () => {
      beforeEach(() => {
        mockCodeGeneratorServiceCompareVersions.mockReturnValueOnce(-1);
      });

      it("should create one request to start a job with the input json", async () => {
        const spyOnSetJobStatus = jest.spyOn(service, "setJobStatus");

        const jobs = await service.splitBuildsIntoJobs(
          adminAndServerInputJson,
          buildId,
          "1.0.0"
        );
        expect(jobs.length).toBe(1);
        expect(jobs).toStrictEqual([[buildId, adminAndServerInputJson]]);
        expect(spyOnSetJobStatus).toBeCalledTimes(1);
      });
    });
  });

  describe("getBuildStatus", () => {
    it("should return Success when all jobs have succeeded", async () => {
      const buildId = "build-id";
      mockOnRedisGet.mockResolvedValue({
        job1: EnumJobStatus.Success,
        job2: EnumJobStatus.Success,
      });

      const status = await service.getBuildStatus(buildId);
      expect(status).toBe(EnumJobStatus.Success);
    });

    it("should return Failure when at least one job has failed", async () => {
      const buildId = "build-id";
      mockOnRedisGet.mockResolvedValue({
        job1: EnumJobStatus.Success,
        job2: EnumJobStatus.Failure,
      });

      const status = await service.getBuildStatus(buildId);
      expect(status).toBe(EnumJobStatus.Failure);
    });

    it("should return InProgress when at least one job is in progress", async () => {
      const buildId = "build-id";
      mockOnRedisGet.mockResolvedValue({
        job1: EnumJobStatus.InProgress,
        job2: EnumJobStatus.Success,
      });

      const status = await service.getBuildStatus(buildId);
      expect(status).toBe(EnumJobStatus.InProgress);
    });
  });

  it("should get the job status based on the jobBuildId (key)", async () => {
    const jobBuildId: JobBuildId<BuildId> = `${buildId}-${EnumDomainName.AdminUI}`;
    const status = EnumJobStatus.Success;
    const value = {
      [jobBuildId]: status,
    };
    mockOnRedisGet.mockResolvedValue(value);

    const result = await service.getJobStatus(jobBuildId);
    expect(mockOnRedisGet).toHaveBeenCalledWith(buildId);
    expect(result).toBe(status);
  });

  it("should set a new job status with the relevant job build status", async () => {
    const jobBuildId: JobBuildId<BuildId> = `${buildId}-${EnumDomainName.AdminUI}`;
    const status = EnumJobStatus.Success;
    const value = {
      [jobBuildId]: status,
    };
    mockOnRedisGet.mockResolvedValue(null);

    const mockRedisSet = jest.spyOn(redisService, "set");

    await service.setJobStatus(jobBuildId, status);

    expect(mockRedisSet).toHaveBeenCalledTimes(1);
    expect(mockRedisSet).toHaveBeenCalledWith(buildId, value);
  });

  describe("extractDomain", () => {
    it("should extract the domain name from the jobBuildId", () => {
      const jobBuildId: JobBuildId<BuildId> = `${buildId}-${EnumDomainName.AdminUI}`;
      expect(service.extractDomain(jobBuildId)).toBe(EnumDomainName.AdminUI);
    });

    it("should return null when the jobBuildId doesn't contain a domain name", () => {
      const jobBuildId: JobBuildId<BuildId> = `${buildId}`;
      expect(service.extractDomain(jobBuildId)).toBe(null);
    });

    it.each([null, undefined])(
      "should return null when the jobBuildId is %s",
      (jobBuildId) => {
        expect(service.extractDomain(jobBuildId)).toBe(null);
      }
    );
  });
});
