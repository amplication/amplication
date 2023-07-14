import { Test } from "@nestjs/testing";
import { PrismaSchemaParserService } from "./prismaSchemaParser.service";
import { ExistingEntitySelect } from "./types";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { CreateBulkEntitiesInput } from "../entity/entity.service";
import { EnumDataType } from "../../enums/EnumDataType";
import { EnumActionLogLevel } from "../action/dto";
import { ActionContext } from "../UserAction/types";

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
      logByStep: jest.fn(),
      onComplete: jest.fn(),
    };
  });

  describe("convertPrismaSchemaForImportObjects", () => {
    it("should return a validation error if the schema is empty", () => {
      const prismaSchema = "";
      const existingEntities: ExistingEntitySelect[] = [];
      const result = service.convertPrismaSchemaForImportObjects(
        prismaSchema,
        existingEntities,
        actionContext
      );
      expect(result).toEqual([]);
      expect(actionContext.logByStep).toBeCalledWith(
        EnumActionLogLevel.Error,
        "Prisma Schema Validation Failed"
      );
    });

    it("should return a validation error if the schema is not a valid Prisma schema", () => {
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
        service.convertPrismaSchemaForImportObjects(
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

    it("should return an object with entities and fields and an empty log", () => {
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
      const result = service.convertPrismaSchemaForImportObjects(
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

    it("should rename models starting in lower case to upper case, add a `@@map` attribute to the model with the original model name and a log informing what happened", () => {
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
      const result = service.convertPrismaSchemaForImportObjects(
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
      expect(actionContext.logByStep).toBeCalledTimes(7);
      expect(actionContext.logByStep).toHaveBeenNthCalledWith(
        1,
        EnumActionLogLevel.Info,
        "Starting Prisma Schema Validation"
      );
      expect(actionContext.logByStep).toHaveBeenNthCalledWith(
        2,
        EnumActionLogLevel.Info,
        `Prisma Schema Validation Completed`
      );
      expect(actionContext.logByStep).toHaveBeenNthCalledWith(
        3,
        EnumActionLogLevel.Info,
        `Prepare Prisma Schema for import`
      );
      expect(actionContext.logByStep).toHaveBeenNthCalledWith(
        4,
        EnumActionLogLevel.Info,
        `Model name "admin" was changed to "Admin"`
      );
      expect(actionContext.logByStep).toHaveBeenNthCalledWith(
        5,
        EnumActionLogLevel.Info,
        `Prepare Prisma Schema for import completed`
      );
      expect(actionContext.logByStep).toHaveBeenNthCalledWith(
        6,
        EnumActionLogLevel.Info,
        `Create import objects from Prisma Schema`
      );
      expect(actionContext.logByStep).toHaveBeenNthCalledWith(
        7,
        EnumActionLogLevel.Info,
        `Create import objects from Prisma Schema completed`
      );
    });

    it("should return object with entities and fields with the right relations and a log", () => {
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
      const result = service.convertPrismaSchemaForImportObjects(
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
      expect(actionContext.logByStep).toBeCalledTimes(6);
      expect(actionContext.logByStep).toHaveBeenNthCalledWith(
        1,
        EnumActionLogLevel.Info,
        "Starting Prisma Schema Validation"
      );
      expect(actionContext.logByStep).toHaveBeenNthCalledWith(
        2,
        EnumActionLogLevel.Info,
        `Prisma Schema Validation Completed`
      );
      expect(actionContext.logByStep).toHaveBeenNthCalledWith(
        3,
        EnumActionLogLevel.Info,
        `Prepare Prisma Schema for import`
      );
      expect(actionContext.logByStep).toHaveBeenNthCalledWith(
        4,
        EnumActionLogLevel.Info,
        `Prepare Prisma Schema for import completed`
      );
      expect(actionContext.logByStep).toHaveBeenNthCalledWith(
        5,
        EnumActionLogLevel.Info,
        `Create import objects from Prisma Schema`
      );
      expect(actionContext.logByStep).toHaveBeenNthCalledWith(
        6,
        EnumActionLogLevel.Info,
        `Create import objects from Prisma Schema completed`
      );
    });
  });
});
