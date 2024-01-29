import { Test, TestingModule } from "@nestjs/testing";
import { DBSchemaImportService } from "./dbSchemaImport.service";
import { ConfigService } from "@nestjs/config";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { DBSchemaImportMetadata } from "./types";
import { CreateDBSchemaImportArgs } from "./dto/CreateDBSchemaImportArgs";
import { EnumUserActionType } from "../userAction/types";
import { User } from "../../models";
import { PrismaService } from "../../prisma";
import { EntityService } from "../entity/entity.service";
import { UserService } from "../user/user.service";
import { UserActionService } from "../userAction/userAction.service";
import { ActionService } from "../action/action.service";
import { KAFKA_TOPICS } from "@amplication/schema-registry";
import { EnumSchemaNames } from "./dto/EnumSchemaNames";
import { calDotComPredefinedSchema } from "./predefinedSchemes/calDotCom/calDotCom";

describe("DbSchemaImportService", () => {
  let service: DBSchemaImportService;
  let kafkaProducerService: KafkaProducerService;

  const mockCreateDBSchemaImportArgs: CreateDBSchemaImportArgs = {
    data: {
      userActionType: EnumUserActionType.DBSchemaImport,
      resource: {
        connect: {
          id: "mockResourceId",
        },
      },
    },
  };

  const mockDBSchemaImportMetadata: DBSchemaImportMetadata = {
    fileName: "mockFileName",
    schema: "mockSchema",
  };

  const mockUser: User = {
    id: "mockUserId",
    createdAt: new Date(),
    updatedAt: new Date(),
    isOwner: true,
  };

  const mockUserAction = {
    id: "mockUserActionId",
    resourceId: "mockResourceId",
    userId: "mockUserId",
    actionId: "mockActionId",
    userActionType: EnumUserActionType.DBSchemaImport,
    metadata: {
      fileName: "mockFileName",
      schema: "mockSchema",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateUserActionByTypeWithInitialStep = jest
    .fn()
    .mockReturnValue(mockUserAction);

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DBSchemaImportService,
        MockedAmplicationLoggerProvider,
        {
          provide: ConfigService,
          useValue: {
            get: (variable) => {
              switch (variable) {
                case "DB_SCHEMA_IMPORT_TOPIC":
                  return "db-schema-import-topic";
                default:
                  return "";
              }
            },
          },
        },
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            userAction: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
            },
          })),
        },
        {
          provide: KafkaProducerService,
          useClass: jest.fn(() => ({
            emitMessage: jest.fn(),
          })),
        },
        {
          provide: EntityService,
          useClass: jest.fn(() => ({
            createEntitiesFromPrismaSchema: jest.fn(),
          })),
        },
        {
          provide: UserService,
          useClass: jest.fn(() => ({
            findUser: jest.fn(),
          })),
        },
        {
          provide: UserActionService,
          useClass: jest.fn(() => ({
            createUserActionByTypeWithInitialStep:
              mockCreateUserActionByTypeWithInitialStep,
          })),
        },
        {
          provide: ActionService,
          useClass: jest.fn(() => ({
            logByStepId: jest.fn(),
            complete: jest.fn(),
          })),
        },
      ],
    }).compile();

    service = module.get<DBSchemaImportService>(DBSchemaImportService);
    kafkaProducerService =
      module.get<KafkaProducerService>(KafkaProducerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should emit message to kafka", async () => {
    await service.startProcessingDBSchema(
      mockCreateDBSchemaImportArgs,
      mockDBSchemaImportMetadata,
      mockUser
    );

    const dbSchemaImportEvent = {
      key: null,
      value: {
        actionId: mockUserAction.actionId,
        file: mockDBSchemaImportMetadata.schema,
      },
    };

    expect(kafkaProducerService.emitMessage).toBeCalledTimes(1);
    expect(kafkaProducerService.emitMessage).toBeCalledWith(
      KAFKA_TOPICS.DB_SCHEMA_IMPORT_TOPIC,
      dbSchemaImportEvent
    );
  });

  describe("getPredefinedSchema", () => {
    it("should return predefined schema", async () => {
      const result = await service.getPredefinedSchema(
        EnumSchemaNames.CalDotCom
      );

      expect(result).toEqual(calDotComPredefinedSchema);
    });

    it("should throw error if schema name is not in EnumSchemaNames", async () => {
      await expect(
        service.getPredefinedSchema("invalidSchemaName" as EnumSchemaNames)
      ).rejects.toThrowError();
    });

    it("should throw error if schema name is undefined", async () => {
      await expect(
        service.getPredefinedSchema(undefined)
      ).rejects.toThrowError();
    });
  });
});
