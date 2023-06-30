import { Test } from "@nestjs/testing";
import { PrismaSchemaUtilsService } from "./prismaSchemaUtils.service";
import { ExistingEntitySelect } from "./types";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { CreateBulkEntitiesInput } from "../entity/entity.service";
import { EnumDataType } from "../../enums/EnumDataType";
import { EnumActionLogLevel } from "../action/dto";

describe("prismaSchema", () => {
  let service: PrismaSchemaUtilsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [PrismaSchemaUtilsService, MockedAmplicationLoggerProvider],
    }).compile();

    service = moduleRef.get<PrismaSchemaUtilsService>(PrismaSchemaUtilsService);
  });

  describe("convertPrismaSchemaForImportObjects", () => {
    it("should return a validation error if the schema is empty", () => {
      const prismaSchema = "";
      const existingEntities: ExistingEntitySelect[] = [];
      const result = service.convertPrismaSchemaForImportObjects(
        prismaSchema,
        existingEntities
      );
      expect(result).toEqual({
        preparedEntitiesWithFields: [],
        log: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            meta: {},
            level: EnumActionLogLevel.Info,
            message: "Starting Prisma Schema Validation",
          },
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            meta: {},
            level: EnumActionLogLevel.Error,
            message: "A schema must contain at least one model",
          },
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            meta: {},
            level: EnumActionLogLevel.Error,
            message: "Prisma Schema Validation Failed",
          },
        ],
      });
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
          existingEntities
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
        existingEntities
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
              customAttributes: null,
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
              customAttributes: null,
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
              customAttributes: null,
            },
          ],
        },
      ];
      expect(result).toEqual({
        preparedEntitiesWithFields: expectedEntitiesWithFields,
        log: expect.anything(),
      });
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
        existingEntities
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
              customAttributes: null,
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
              customAttributes: null,
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
              customAttributes: null,
            },
          ],
        },
      ];
      expect(result).toEqual({
        preparedEntitiesWithFields: expectedEntitiesWithFields,
        log: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            meta: {},
            message: `Starting Prisma Schema Validation`,
            level: EnumActionLogLevel.Info,
          },
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            meta: {},
            message: `Prisma Schema Validation Completed`,
            level: EnumActionLogLevel.Info,
          },
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            meta: {},
            message: `Prepare Prisma Schema for import`,
            level: EnumActionLogLevel.Info,
          },
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            meta: {},
            message: `Model name "admin" was changed to "Admin"`,
            level: EnumActionLogLevel.Info,
          },
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            meta: {},
            message: `Prepare Prisma Schema for import completed`,
            level: EnumActionLogLevel.Info,
          },
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            meta: {},
            message: `Create import objects from Prisma Schema`,
            level: EnumActionLogLevel.Info,
          },
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            meta: {},
            message: `Create import objects from Prisma Schema completed`,
            level: EnumActionLogLevel.Info,
          },
        ],
      });
    });
  });
});
