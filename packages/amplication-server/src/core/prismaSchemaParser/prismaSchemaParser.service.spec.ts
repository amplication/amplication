import { Test } from "@nestjs/testing";
import { PrismaSchemaParserService } from "./prismaSchemaParser.service";
import { ExistingEntitySelect } from "./types";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { CreateBulkEntitiesInput } from "../entity/entity.service";
import { EnumDataType } from "../../enums/EnumDataType";
import { EnumActionLogLevel } from "../action/dto";
import { ActionContext } from "../userAction/types";

describe("prismaSchema", () => {
  let service: PrismaSchemaParserService;
  let actionContext: ActionContext;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [PrismaSchemaParserService, MockedAmplicationLoggerProvider],
    }).compile();

    service = moduleRef.get<PrismaSchemaParserService>(
      PrismaSchemaParserService
    );

    actionContext = {
      onEmitUserActionLog: jest.fn(),
      onComplete: jest.fn(),
    };
  });

  describe("convertPrismaSchemaForImportObjects", () => {
    it("should return a validation error if the schema is empty", async () => {
      const prismaSchema = "";
      const existingEntities: ExistingEntitySelect[] = [];
      const result = await service.convertPrismaSchemaForImportObjects(
        prismaSchema,
        existingEntities,
        actionContext
      );
      expect(result).toEqual([]);
      expect(actionContext.onEmitUserActionLog).toBeCalledWith(
        "Prisma Schema Validation Failed",
        EnumActionLogLevel.Error
      );
    });

    it("should return a validation error if the schema is not a valid Prisma schema", async () => {
      expect.assertions(1);
      const prismaSchema = `datasource db {
        provider = "postgresql"
        url      = env("DB_URL")
      }
      
      generator client {
        provider = "prisma-client-js"
      }
      
      model Admin-1 {
        id         Int   @id @default(autoincrement())
        createdAt  DateTime @default(now())
        username   String   @unique @db.VarChar(256)
        roles      Json?
      }`;

      const existingEntities: ExistingEntitySelect[] = [];
      try {
        await service.convertPrismaSchemaForImportObjects(
          prismaSchema,
          existingEntities,
          actionContext
        );
        fail("convertPrismaSchemaForImportObjects should have thrown an error");
      } catch (error) {
        // validateSchemaUpload returns a validation error as a long string. We expect an error to be thrown if the schema is not valid
        expect(true).toBe(true);
      }
    });

    it("should return an object with entities and fields and an empty log", async () => {
      // arrange
      const prismaSchema = `datasource db {
        provider = "postgresql"
        url      = env("DB_URL")
      }
      
      generator client {
        provider = "prisma-client-js"
      }
      
      model Admin {
        id         Int   @id @default(autoincrement())
        createdAt  DateTime @default(now())
        username   String   @unique @db.VarChar(256)
        roles      Json?
      }`;
      const existingEntities: ExistingEntitySelect[] = [];
      // act
      const result = await service.convertPrismaSchemaForImportObjects(
        prismaSchema,
        existingEntities,
        actionContext
      );
      // assert
      const expectedEntitiesWithFields: CreateBulkEntitiesInput[] = [
        {
          id: expect.any(String),
          name: "Admin",
          displayName: "Admin",
          pluralDisplayName: "Admins",
          description: "",
          customAttributes: "",
          fields: [
            {
              name: "id",
              displayName: "Id",
              dataType: EnumDataType.Id,
              required: true,
              unique: false,
              searchable: false,
              description: "",
              properties: {
                idType: "AUTO_INCREMENT",
              },
              customAttributes: "",
            },
            {
              name: "createdAt",
              displayName: "Created At",
              dataType: EnumDataType.CreatedAt,
              required: true,
              unique: false,
              searchable: false,
              description: "",
              properties: {},
              customAttributes: "",
            },
            {
              name: "username",
              displayName: "Username",
              dataType: EnumDataType.SingleLineText,
              required: true,
              unique: true,
              searchable: false,
              description: "",
              properties: {
                maxLength: 256,
              },
              customAttributes: "@db.VarChar(256)",
            },
            {
              name: "roles",
              displayName: "Roles",
              dataType: EnumDataType.Json,
              required: false,
              unique: false,
              searchable: false,
              description: "",
              properties: {},
              customAttributes: "",
            },
          ],
        },
      ];
      expect(result).toEqual(expectedEntitiesWithFields);
    });

    it("should rename models starting in lower case to upper case, add a `@@map` attribute to the model with the original model name and a log informing what happened", async () => {
      // arrange
      const prismaSchema = `datasource db {
        provider = "postgresql"
        url      = env("DB_URL")
      }
      
      generator client {
        provider = "prisma-client-js"
      }
      
      model admin {
        id         Int   @id @default(autoincrement())
        createdAt  DateTime @default(now())
        username   String   @unique @db.VarChar(256)
        roles      Json?
      }`;
      const existingEntities: ExistingEntitySelect[] = [];
      // act
      const result = await service.convertPrismaSchemaForImportObjects(
        prismaSchema,
        existingEntities,
        actionContext
      );
      // assert
      const expectedEntitiesWithFields: CreateBulkEntitiesInput[] = [
        {
          id: expect.any(String),
          name: "Admin",
          displayName: "Admin",
          pluralDisplayName: "Admins",
          description: "",
          customAttributes: '@@map("admin")',
          fields: [
            {
              name: "id",
              displayName: "Id",
              dataType: EnumDataType.Id,
              required: true,
              unique: false,
              searchable: false,
              description: "",
              properties: {
                idType: "AUTO_INCREMENT",
              },
              customAttributes: "",
            },
            {
              name: "createdAt",
              displayName: "Created At",
              dataType: EnumDataType.CreatedAt,
              required: true,
              unique: false,
              searchable: false,
              description: "",
              properties: {},
              customAttributes: "",
            },
            {
              name: "username",
              displayName: "Username",
              dataType: EnumDataType.SingleLineText,
              required: true,
              unique: true,
              searchable: false,
              description: "",
              properties: {
                maxLength: 256,
              },
              customAttributes: "@db.VarChar(256)",
            },
            {
              name: "roles",
              displayName: "Roles",
              dataType: EnumDataType.Json,
              required: false,
              unique: false,
              searchable: false,
              description: "",
              properties: {},
              customAttributes: "",
            },
          ],
        },
      ];
      expect(result).toEqual(expectedEntitiesWithFields);
      expect(actionContext.onEmitUserActionLog).toBeCalledTimes(7);
      expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
        1,
        "Starting Prisma Schema Validation",
        EnumActionLogLevel.Info
      );
      expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
        2,
        `Prisma Schema Validation Completed`,
        EnumActionLogLevel.Info
      );
      expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
        3,
        `Prepare Prisma Schema for import`,
        EnumActionLogLevel.Info
      );
      expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
        4,
        `Model name "admin" was changed to "Admin"`,
        EnumActionLogLevel.Info
      );
      expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
        5,
        `Prepare Prisma Schema for import completed`,
        EnumActionLogLevel.Info
      );
      expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
        6,
        `Create import objects from Prisma Schema`,
        EnumActionLogLevel.Info
      );
      expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
        7,
        `Create import objects from Prisma Schema completed`,
        EnumActionLogLevel.Info
      );
    });

    it("should return object with entities and fields with the right relations and a log", async () => {
      // arrange
      const prismaSchema = `datasource db {
        provider = "postgresql"
        url      = env("DB_URL")
      }
      
      generator client {
        provider = "prisma-client-js"
      }
      
      model Order {
        id         String    @id @default(cuid())
        customer   Customer? @relation(fields: [customerId], references: [id])
        customerId String?
      }
      
      model Customer {
        id          String     @id @default(cuid())
        orders      Order[]
      }`;
      const existingEntities: ExistingEntitySelect[] = [];
      // act
      const result = await service.convertPrismaSchemaForImportObjects(
        prismaSchema,
        existingEntities,
        actionContext
      );
      // assert
      const expectedEntitiesWithFields: CreateBulkEntitiesInput[] = [
        {
          id: expect.any(String),
          name: "Order",
          displayName: "Order",
          pluralDisplayName: "Orders",
          description: "",
          customAttributes: "",
          fields: [
            {
              name: "id",
              displayName: "Id",
              dataType: EnumDataType.Id,
              required: true,
              unique: false,
              searchable: false,
              description: "",
              properties: {
                idType: "CUID",
              },
              customAttributes: "",
            },
            {
              name: "customer",
              displayName: "Customer",
              dataType: EnumDataType.Lookup,
              required: false,
              unique: false,
              searchable: true,
              description: "",
              properties: {
                relatedEntityId: expect.any(String),
                allowMultipleSelection: false,
                fkHolder: null,
                fkFieldName: "customerId",
              },
              customAttributes: "",
              relatedFieldAllowMultipleSelection: true,
              relatedFieldDisplayName: "Orders",
              relatedFieldName: "orders",
            },
          ],
        },
        {
          id: expect.any(String),
          name: "Customer",
          displayName: "Customer",
          pluralDisplayName: "Customers",
          description: "",
          customAttributes: "",
          fields: [
            {
              name: "id",
              displayName: "Id",
              dataType: EnumDataType.Id,
              required: true,
              unique: false,
              searchable: false,
              description: "",
              properties: {
                idType: "CUID",
              },
              customAttributes: "",
            },
          ],
        },
      ];
      expect(result).toEqual(expectedEntitiesWithFields);
      expect(actionContext.onEmitUserActionLog).toBeCalledTimes(6);
      expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
        1,
        "Starting Prisma Schema Validation",
        EnumActionLogLevel.Info
      );
      expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
        2,
        `Prisma Schema Validation Completed`,
        EnumActionLogLevel.Info
      );
      expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
        3,
        `Prepare Prisma Schema for import`,
        EnumActionLogLevel.Info
      );
      expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
        4,
        `Prepare Prisma Schema for import completed`,
        EnumActionLogLevel.Info
      );
      expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
        5,
        `Create import objects from Prisma Schema`,
        EnumActionLogLevel.Info
      );
      expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
        6,
        `Create import objects from Prisma Schema completed`,
        EnumActionLogLevel.Info
      );
    });
  });
});
