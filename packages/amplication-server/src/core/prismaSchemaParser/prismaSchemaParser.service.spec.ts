import { Test } from "@nestjs/testing";
import { PrismaSchemaParserService } from "./prismaSchemaParser.service";
import { ExistingEntitySelect } from "./types";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { CreateBulkEntitiesInput } from "../entity/entity.service";
import { EnumDataType } from "../../enums/EnumDataType";
import { EnumActionLogLevel } from "../action/dto";
import { ActionContext } from "../userAction/types";
import * as validators from "./validators";

describe("prismaSchemaParser", () => {
  let service: PrismaSchemaParserService;
  let actionContext: ActionContext;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(validators, "isValidSchema").mockReset();

    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [PrismaSchemaParserService, MockedAmplicationLoggerProvider],
    }).compile();

    service = moduleRef.get<PrismaSchemaParserService>(
      PrismaSchemaParserService
    );

    actionContext = {
      onEmitUserActionLog: jest.fn(),
    };
  });

  describe("convertPrismaSchemaForImportObjects", () => {
    describe("when the schema is invalid", () => {
      beforeEach(() => {
        jest.spyOn(validators, "isValidSchema").mockImplementation(() => ({
          isValid: false,
          errorMessage: "Prisma Schema Validation Failed",
        }));
      });
      it("should return a validation error if the schema is empty", async () => {
        const prismaSchema = "";
        const existingEntities: ExistingEntitySelect[] = [];

        await expect(
          service.convertPrismaSchemaForImportObjects(
            prismaSchema,
            existingEntities,
            actionContext
          )
        ).rejects.toThrowError("Prisma Schema Validation Failed");
      });

      it("should return a validation error if the schema is not a valid Prisma schema", async () => {
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

        await expect(
          service.convertPrismaSchemaForImportObjects(
            prismaSchema,
            existingEntities,
            actionContext
          )
        ).rejects.toThrowError("Prisma Schema Validation Failed");
      });
    });

    describe("when the schema is valid", () => {
      beforeEach(() => {
        jest.spyOn(validators, "isValidSchema").mockImplementation(() => ({
          isValid: true,
        }));
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
                permanentId: expect.any(String),
                name: "id",
                displayName: "Id",
                dataType: EnumDataType.Id,
                required: true,
                unique: false,
                searchable: true,
                description: "",
                properties: {
                  idType: "AUTO_INCREMENT",
                },
                customAttributes: "@id @default(autoincrement())",
              },
              {
                permanentId: expect.any(String),
                name: "createdAt",
                displayName: "Created At",
                dataType: EnumDataType.CreatedAt,
                required: true,
                unique: false,
                searchable: true,
                description: "",
                properties: {},
                customAttributes: "",
              },
              {
                permanentId: expect.any(String),
                name: "username",
                displayName: "Username",
                dataType: EnumDataType.SingleLineText,
                required: true,
                unique: true,
                searchable: true,
                description: "",
                properties: {
                  maxLength: 256,
                },
                customAttributes: "@db.VarChar(256)",
              },
              {
                permanentId: expect.any(String),
                name: "roles",
                displayName: "Roles",
                dataType: EnumDataType.Json,
                required: false,
                unique: false,
                searchable: true,
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
                permanentId: expect.any(String),
                name: "id",
                displayName: "Id",
                dataType: EnumDataType.Id,
                required: true,
                unique: false,
                searchable: true,
                description: "",
                properties: {
                  idType: "AUTO_INCREMENT",
                },
                customAttributes: "@id @default(autoincrement())",
              },
              {
                permanentId: expect.any(String),
                name: "createdAt",
                displayName: "Created At",
                dataType: EnumDataType.CreatedAt,
                required: true,
                unique: false,
                searchable: true,
                description: "",
                properties: {},
                customAttributes: "",
              },
              {
                permanentId: expect.any(String),
                name: "username",
                displayName: "Username",
                dataType: EnumDataType.SingleLineText,
                required: true,
                unique: true,
                searchable: true,
                description: "",
                properties: {
                  maxLength: 256,
                },
                customAttributes: "@db.VarChar(256)",
              },
              {
                permanentId: expect.any(String),
                name: "roles",
                displayName: "Roles",
                dataType: EnumDataType.Json,
                required: false,
                unique: false,
                searchable: true,
                description: "",
                properties: {},
                customAttributes: "",
              },
            ],
          },
        ];
        expect(result).toEqual(expectedEntitiesWithFields);
        expect(actionContext.onEmitUserActionLog).toBeCalledTimes(8);
        expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
          1,
          "Starting Prisma Schema Validation",
          EnumActionLogLevel.Info
        );
        expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
          2,
          `Prisma Schema Validation completed successfully`,
          EnumActionLogLevel.Info
        );
        expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
          3,
          `Prepare Prisma Schema for import`,
          EnumActionLogLevel.Info
        );
        expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
          4,
          `attribute "@@map" was added to the model "admin"`,
          EnumActionLogLevel.Info
        );
        expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
          5,
          `Model name "admin" was changed to "Admin"`,
          EnumActionLogLevel.Info
        );
        expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
          6,
          `Prepare Prisma Schema for import completed`,
          EnumActionLogLevel.Info
        );
        expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
          7,
          `Create import objects from Prisma Schema`,
          EnumActionLogLevel.Info
        );
        expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
          8,
          `Create import objects from Prisma Schema completed`,
          EnumActionLogLevel.Info
        );
      });

      it("should NOT add the `@map` attribute to a field if it is already exists", async () => {
        // arrange
        const prismaSchema = `datasource db {
          provider = "postgresql"
          url      = env("DB_URL")
        }
        
        generator client {
          provider = "prisma-client-js"
        }
        
        model Superman {
          id         Int   @id @default(autoincrement())
          createdAt  DateTime @default(now())
          super_power   String   @map("super_power_123")
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
            name: "Superman",
            displayName: "Superman",
            pluralDisplayName: "Supermen",
            description: "",
            customAttributes: "",
            fields: [
              {
                permanentId: expect.any(String),
                name: "id",
                displayName: "Id",
                dataType: EnumDataType.Id,
                required: true,
                unique: false,
                searchable: true,
                description: "",
                properties: {
                  idType: "AUTO_INCREMENT",
                },
                customAttributes: "@id @default(autoincrement())",
              },
              {
                permanentId: expect.any(String),
                name: "createdAt",
                displayName: "Created At",
                dataType: EnumDataType.CreatedAt,
                required: true,
                unique: false,
                searchable: true,
                description: "",
                properties: {},
                customAttributes: "",
              },
              {
                permanentId: expect.any(String),
                name: "superPower",
                displayName: "Super Power",
                dataType: EnumDataType.SingleLineText,
                required: true,
                unique: false,
                searchable: true,
                description: "",
                properties: {
                  maxLength: 256,
                },
                customAttributes: '@map("super_power_123")', // the original @map attribute should be kept, and no new one should be added
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
          `Prisma Schema Validation completed successfully`,
          EnumActionLogLevel.Info
        );
        expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
          3,
          `Prepare Prisma Schema for import`,
          EnumActionLogLevel.Info
        );
        expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
          4,
          `Field name "super_power" on model Superman was changed to "superPower"`,
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

      it("should NOT add the `@@map` attribute to the model if it is already exists", async () => {
        // arrange
        const prismaSchema = `datasource db {
          provider = "postgresql"
          url      = env("DB_URL")
        }
        
        generator client {
          provider = "prisma-client-js"
        }
        
        model my_admin {
          id         Int   @id @default(autoincrement())
          createdAt  DateTime @default(now())
          username   String   @unique @db.VarChar(256)
          roles      Json?

          @@map("my_admin_123")
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
            name: "MyAdmin",
            displayName: "My Admin",
            pluralDisplayName: "MyAdmins",
            description: "",
            customAttributes: '@@map("my_admin_123")', // the original @@map attribute should be kept, and no new one should be added
            fields: [
              {
                permanentId: expect.any(String),
                name: "id",
                displayName: "Id",
                dataType: EnumDataType.Id,
                required: true,
                unique: false,
                searchable: true,
                description: "",
                properties: {
                  idType: "AUTO_INCREMENT",
                },
                customAttributes: "@id @default(autoincrement())",
              },
              {
                permanentId: expect.any(String),
                name: "createdAt",
                displayName: "Created At",
                dataType: EnumDataType.CreatedAt,
                required: true,
                unique: false,
                searchable: true,
                description: "",
                properties: {},
                customAttributes: "",
              },
              {
                permanentId: expect.any(String),
                name: "username",
                displayName: "Username",
                dataType: EnumDataType.SingleLineText,
                required: true,
                unique: true,
                searchable: true,
                description: "",
                properties: {
                  maxLength: 256,
                },
                customAttributes: "@db.VarChar(256)",
              },
              {
                permanentId: expect.any(String),
                name: "roles",
                displayName: "Roles",
                dataType: EnumDataType.Json,
                required: false,
                unique: false,
                searchable: true,
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
          `Prisma Schema Validation completed successfully`,
          EnumActionLogLevel.Info
        );
        expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
          3,
          `Prepare Prisma Schema for import`,
          EnumActionLogLevel.Info
        );
        expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
          4,
          `Model name "my_admin" was changed to "MyAdmin"`,
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

      describe("when we handle the id field", () => {
        it("should add an id field type String (idType CUID) if it doesn't exist", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Admin {
            createdAt  DateTime @default(now())
            username   String   @db.VarChar(256)
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
                  permanentId: expect.any(String),
                  name: "createdAt",
                  displayName: "Created At",
                  dataType: EnumDataType.CreatedAt,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {},
                  customAttributes: "",
                },
                {
                  permanentId: expect.any(String),
                  name: "username",
                  displayName: "Username",
                  dataType: EnumDataType.SingleLineText,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    maxLength: 256,
                  },
                  customAttributes: "@db.VarChar(256)",
                },
                {
                  permanentId: expect.any(String),
                  name: "roles",
                  displayName: "Roles",
                  dataType: EnumDataType.Json,
                  required: false,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {},
                  customAttributes: "",
                },
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "@id @default(cuid())",
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });

        it("should rename a field to id if it is a unique field and its type is a valid id type and add the id and the a map with the original name", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Admin {
            username   String   @unique @db.VarChar(256)
            createdAt  DateTime @default(now())
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
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: true,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes:
                    '@db.VarChar(256) @map("username") @id @default(cuid())',
                },
                {
                  permanentId: expect.any(String),
                  name: "createdAt",
                  displayName: "Created At",
                  dataType: EnumDataType.CreatedAt,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {},
                  customAttributes: "",
                },
                {
                  permanentId: expect.any(String),
                  name: "roles",
                  displayName: "Roles",
                  dataType: EnumDataType.Json,
                  required: false,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {},
                  customAttributes: "",
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });

        it("should rename a field to id if it is a unique field and its type is a valid id type and add the id and should NOT add the a map with the original name", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Admin {
            username   String   @unique @db.VarChar(256) @map("username_123")
            createdAt  DateTime @default(now())
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
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: true,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes:
                    '@db.VarChar(256) @map("username_123") @id @default(cuid())',
                },
                {
                  permanentId: expect.any(String),
                  name: "createdAt",
                  displayName: "Created At",
                  dataType: EnumDataType.CreatedAt,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {},
                  customAttributes: "",
                },
                {
                  permanentId: expect.any(String),
                  name: "roles",
                  displayName: "Roles",
                  dataType: EnumDataType.Json,
                  required: false,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {},
                  customAttributes: "",
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });

        it("should add the @id attribute to a field if its name is id but it is only decorated with the @unique attribute and it can be used as a valid id field", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Admin {
            id Int @unique
            username String
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
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: true,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "AUTO_INCREMENT",
                  },
                  customAttributes: "@id @default(autoincrement())",
                },
                {
                  permanentId: expect.any(String),
                  name: "username",
                  displayName: "Username",
                  dataType: EnumDataType.SingleLineText,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    maxLength: 256,
                  },
                  customAttributes: "",
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });

        it("should add the @id attribute to unique field named id, when the model has other unique fields", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Admin {
            test String @unique
            id Int @unique
            username String
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
                  permanentId: expect.any(String),
                  name: "test",
                  displayName: "Test",
                  dataType: EnumDataType.SingleLineText,
                  required: true,
                  unique: true,
                  searchable: true,
                  description: "",
                  properties: {
                    maxLength: 256,
                  },
                  customAttributes: "",
                },
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: true,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "AUTO_INCREMENT",
                  },
                  customAttributes: "@id @default(autoincrement())",
                },
                {
                  permanentId: expect.any(String),
                  name: "username",
                  displayName: "Username",
                  dataType: EnumDataType.SingleLineText,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    maxLength: 256,
                  },
                  customAttributes: "",
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });

        it("should throw an error when the id field is the PK of the model AND the FK of the relation", async () => {
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
  
          model User {
            profile            Profile?          @relation(fields: [profile_id], references: [id])
            profile_id          Int?              @id @default(autoincrement())
          }
          
          model Profile {
            profile_id        Int      @id @default(autoincrement())
            user      User?
          }`;

          const existingEntities: ExistingEntitySelect[] = [];

          await expect(
            service.convertPrismaSchemaForImportObjects(
              prismaSchema,
              existingEntities,
              actionContext
            )
          ).rejects.toThrowError(
            `Using the foreign key field as the primary key is not supported. The field "profile_id" is a primary key on model "User" but also a foreign key on the related model. Please fix this issue and import the schema again.`
          );
        });

        it("should rename a PK field if is not named id and add the map attribute with the original name", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Admin {
            something String @id @default(cuid())
            username String
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
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: '@id @default(cuid()) @map("something")',
                },
                {
                  permanentId: expect.any(String),
                  name: "username",
                  displayName: "Username",
                  dataType: EnumDataType.SingleLineText,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    maxLength: 256,
                  },
                  customAttributes: "",
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });

        it("should rename a field named id to the {modelName}Id if it is not the PK of the model and add a @map attribute with the original name", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Admin {
            id String 
            something Int @id @default(autoincrement()) 
            username String
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
                  permanentId: expect.any(String),
                  name: "adminId",
                  displayName: "Admin Id",
                  dataType: EnumDataType.SingleLineText,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    maxLength: 256,
                  },
                  customAttributes: '@map("id")',
                },
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "AUTO_INCREMENT",
                  },
                  customAttributes:
                    '@id @default(autoincrement()) @map("something")',
                },
                {
                  permanentId: expect.any(String),
                  name: "username",
                  displayName: "Username",
                  dataType: EnumDataType.SingleLineText,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    maxLength: 256,
                  },
                  customAttributes: "",
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });
        it("should create the id attributes correctly", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Test {
            id          String @id(map: "PK_123456789") @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
            name        String @db.VarChar(255)
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
              name: "Test",
              displayName: "Test",
              pluralDisplayName: "Tests",
              description: "",
              customAttributes: "",
              fields: [
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes:
                    '@id(map: "PK_123456789") @default(dbgenerated("uuid_generate_v4()")) @db.Uuid',
                },
                {
                  permanentId: expect.any(String),
                  name: "name",
                  displayName: "Name",
                  dataType: EnumDataType.SingleLineText,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    maxLength: 256,
                  },
                  customAttributes: "@db.VarChar(255)",
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });
      });

      describe("when the field is a type of Number", () => {
        it("should create a field type Decimal with the correct DecimalNumber Properties", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Product {
            id String @id @default(cuid())
            name   String    
            price  Decimal         
          
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
              name: "Product",
              displayName: "Product",
              pluralDisplayName: "Products",
              description: "",
              customAttributes: "",
              fields: [
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "@id @default(cuid())",
                },
                {
                  permanentId: expect.any(String),
                  name: "name",
                  displayName: "Name",
                  dataType: EnumDataType.SingleLineText,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    maxLength: 256,
                  },
                  customAttributes: "",
                },
                {
                  permanentId: expect.any(String),
                  name: "price",
                  displayName: "Price",
                  dataType: EnumDataType.DecimalNumber,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    databaseFieldType: "DECIMAL",
                    minimumValue: 0,
                    maximumValue: 99999999999,
                    precision: 8,
                  },
                  customAttributes: "",
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });
        it("should create a field type Float with the correct DecimalNumber Properties", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Product {
            id String @id @default(cuid())
            name   String    
            price  Float         
          
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
              name: "Product",
              displayName: "Product",
              pluralDisplayName: "Products",
              description: "",
              customAttributes: "",
              fields: [
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "@id @default(cuid())",
                },
                {
                  permanentId: expect.any(String),
                  name: "name",
                  displayName: "Name",
                  dataType: EnumDataType.SingleLineText,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    maxLength: 256,
                  },
                  customAttributes: "",
                },
                {
                  permanentId: expect.any(String),
                  name: "price",
                  displayName: "Price",
                  dataType: EnumDataType.DecimalNumber,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    databaseFieldType: "FLOAT",
                    minimumValue: 0,
                    maximumValue: 99999999999,
                    precision: 8,
                  },
                  customAttributes: "",
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });
        it("should create a field type Int with the correct WholeNumber Properties", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Product {
            id String @id @default(cuid())
            name   String    
            amount  Int         
          
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
              name: "Product",
              displayName: "Product",
              pluralDisplayName: "Products",
              description: "",
              customAttributes: "",
              fields: [
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "@id @default(cuid())",
                },
                {
                  permanentId: expect.any(String),
                  name: "name",
                  displayName: "Name",
                  dataType: EnumDataType.SingleLineText,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    maxLength: 256,
                  },
                  customAttributes: "",
                },
                {
                  permanentId: expect.any(String),
                  name: "amount",
                  displayName: "Amount",
                  dataType: EnumDataType.WholeNumber,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    databaseFieldType: "INT",
                    minimumValue: 0,
                    maximumValue: 99999999999,
                  },
                  customAttributes: "",
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });
        it("should create a field type BigInt with the correct WholeNumber Properties", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Product {
            id String @id @default(cuid())
            name   String    
            amount BigInt         
          
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
              name: "Product",
              displayName: "Product",
              pluralDisplayName: "Products",
              description: "",
              customAttributes: "",
              fields: [
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "@id @default(cuid())",
                },
                {
                  permanentId: expect.any(String),
                  name: "name",
                  displayName: "Name",
                  dataType: EnumDataType.SingleLineText,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    maxLength: 256,
                  },
                  customAttributes: "",
                },
                {
                  permanentId: expect.any(String),
                  name: "amount",
                  displayName: "Amount",
                  dataType: EnumDataType.WholeNumber,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    databaseFieldType: "BIG_INT",
                    minimumValue: 0,
                    maximumValue: 99999999999,
                  },
                  customAttributes: "",
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });
      });

      describe("when the field data type translated to Id type", () => {
        it("should create an id field type CUID when the field type is String and @default attribute has a function argument cuid()", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Product {
          id String @id @default(cuid())        
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
              name: "Product",
              displayName: "Product",
              pluralDisplayName: "Products",
              description: "",
              customAttributes: "",
              fields: [
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "@id @default(cuid())",
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });

        it("should create an id field type UUID when the field type is String and the @default attribute has a function argument uuid()", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Product {
          id String @id @default(uuid())        
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
              name: "Product",
              displayName: "Product",
              pluralDisplayName: "Products",
              description: "",
              customAttributes: "",
              fields: [
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "UUID",
                  },
                  customAttributes: "@id @default(uuid())",
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });

        it("should create an id field type AUTO_INCREMENT when the id type is Int and the @default attribute has a function argument autoincrement()", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Product {
          id Int @id @default(autoincrement())        
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
              name: "Product",
              displayName: "Product",
              pluralDisplayName: "Products",
              description: "",
              customAttributes: "",
              fields: [
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "AUTO_INCREMENT",
                  },
                  customAttributes: "@id @default(autoincrement())",
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });

        it("should create an id field type AUTO_INCREMENT_BIG_INT when the id type is BigInt and the @default attribute has a function argument autoincrement()", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Product {
          id BigInt @id @default(autoincrement())        
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
              name: "Product",
              displayName: "Product",
              pluralDisplayName: "Products",
              description: "",
              customAttributes: "",
              fields: [
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "AUTO_INCREMENT_BIG_INT",
                  },
                  customAttributes: "@id @default(autoincrement())",
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });
      });
      describe("when model has @@index/@@id/@@unique attributes", () => {
        it("should convert @@id attribute to @@unique attribute", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Doctor {
            first_name   String    
            license_id     Int
          
            @@id([first_name, license_id], map: "doctor_first_name_license_id_unique")
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
              name: "Doctor",
              displayName: "Doctor",
              pluralDisplayName: "Doctors",
              description: "",
              customAttributes:
                '@@unique([firstName, licenseId], map: "doctor_first_name_license_id_unique")',
              fields: [
                {
                  permanentId: expect.any(String),
                  name: "firstName",
                  displayName: "First Name",
                  dataType: EnumDataType.SingleLineText,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    maxLength: 256,
                  },
                  customAttributes: '@map("first_name")',
                },
                {
                  permanentId: expect.any(String),
                  name: "licenseId",
                  displayName: "License Id",
                  dataType: EnumDataType.WholeNumber,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    databaseFieldType: "INT",
                    maximumValue: 99999999999,
                    minimumValue: 0,
                  },
                  customAttributes: '@map("license_id")',
                },
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "@id @default(cuid())",
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });

        it("should format the args in the @@index attribute in the same way they were formatted in the model fields", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Doctor {
            id          String     @id @default(cuid())
            first_name   String    
            license_id     Int
          
            @@index([first_name, license_id], map: "doctor_first_name_license_id_unique")
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
              name: "Doctor",
              displayName: "Doctor",
              pluralDisplayName: "Doctors",
              description: "",
              customAttributes:
                '@@index([firstName, licenseId], map: "doctor_first_name_license_id_unique")',
              fields: [
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "@id @default(cuid())",
                },
                {
                  permanentId: expect.any(String),
                  name: "firstName",
                  displayName: "First Name",
                  dataType: EnumDataType.SingleLineText,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    maxLength: 256,
                  },
                  customAttributes: '@map("first_name")',
                },
                {
                  permanentId: expect.any(String),
                  name: "licenseId",
                  displayName: "License Id",
                  dataType: EnumDataType.WholeNumber,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    databaseFieldType: "INT",
                    maximumValue: 99999999999,
                    minimumValue: 0,
                  },
                  customAttributes: '@map("license_id")',
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });

        it("should NOT format the args in the @@index attribute if they were not formatted in the model fields AND even if the field name exists on another model", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }

          model Admin {
            id          Int     @id @default(autoincrement())
            customer_type String
            customer_id String
          }

          model Order {
            id         String    @id @default(cuid())
            order_number   Int
            the_customer   Customer? @relation(fields: [customer_id], references: [id])
            customer_id String?

            @@index([customer_id, order_number], map: "customer_id_order_number")
          }
          
          model Customer {
            id          String     @id @default(cuid())
            customer_type CustomerType? @default(INDIVIDUAL)
            customer_id_number Int
            orders  Order[]

            @@index([customer_type, customer_id_number], map: "customer_type_customer_id_number")
          }

          enum CustomerType {
            INDIVIDUAL
            COMPANY
          }
          `;
          const customerFieldPermanentId = expect.any(String);
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
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "AUTO_INCREMENT",
                  },
                  customAttributes: "@id @default(autoincrement())",
                },
                {
                  permanentId: expect.any(String),
                  name: "customerType",
                  displayName: "Customer Type",
                  dataType: EnumDataType.SingleLineText,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    maxLength: 256,
                  },
                  customAttributes: '@map("customer_type")',
                },
                {
                  permanentId: expect.any(String),
                  name: "customerId",
                  displayName: "Customer Id",
                  dataType: EnumDataType.SingleLineText,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    maxLength: 256,
                  },
                  customAttributes: '@map("customer_id")',
                },
              ],
            },
            {
              id: expect.any(String),
              name: "Order",
              displayName: "Order",
              pluralDisplayName: "Orders",
              description: "",
              customAttributes:
                '@@index([customer_id, orderNumber], map: "customer_id_order_number")',
              fields: [
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "@id @default(cuid())",
                },
                {
                  permanentId: expect.any(String),
                  name: "orderNumber",
                  displayName: "Order Number",
                  dataType: EnumDataType.WholeNumber,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    databaseFieldType: "INT",
                    maximumValue: 99999999999,
                    minimumValue: 0,
                  },
                  customAttributes: '@map("order_number")',
                },
                {
                  permanentId: expect.any(String),
                  name: "theCustomer",
                  displayName: "The Customer",
                  dataType: EnumDataType.Lookup,
                  required: false,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    relatedEntityId: expect.any(String),
                    allowMultipleSelection: false,
                    fkHolder: customerFieldPermanentId,
                    fkFieldName: "customer_id",
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
              customAttributes:
                '@@index([customer_type, customerIdNumber], map: "customer_type_customer_id_number")',
              fields: [
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "@id @default(cuid())",
                },
                {
                  permanentId: expect.any(String),
                  name: "customer_type",
                  displayName: "Customer Type",
                  dataType: EnumDataType.OptionSet,
                  required: false,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    options: [
                      { label: "INDIVIDUAL", value: "INDIVIDUAL" },
                      { label: "COMPANY", value: "COMPANY" },
                    ],
                  },
                  customAttributes: "@default(INDIVIDUAL)",
                },
                {
                  permanentId: expect.any(String),
                  name: "customerIdNumber",
                  displayName: "Customer Id Number",
                  dataType: EnumDataType.WholeNumber,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    databaseFieldType: "INT",
                    maximumValue: 99999999999,
                    minimumValue: 0,
                  },
                  customAttributes: '@map("customer_id_number")',
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });

        it("should NOT format the args in the @@index attribute if they were not formatted in the model fields", async () => {
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
            order_number   Int
            the_customer   Customer? @relation(fields: [customer_id], references: [id])
            customer_id String?

            @@index([customer_id, order_number], map: "customer_id_order_number")
          }
          
          model Customer {
            id          String     @id @default(cuid())
            customer_type CustomerType? @default(INDIVIDUAL)
            customer_id_number Int
            orders  Order[]

            @@index([customer_type, customer_id_number], map: "customer_type_customer_id_number")
          }

          enum CustomerType {
            INDIVIDUAL
            COMPANY
          }
          `;
          const customerFieldPermanentId = expect.any(String);
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
              customAttributes:
                '@@index([customer_id, orderNumber], map: "customer_id_order_number")',
              fields: [
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "@id @default(cuid())",
                },
                {
                  permanentId: expect.any(String),
                  name: "orderNumber",
                  displayName: "Order Number",
                  dataType: EnumDataType.WholeNumber,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    databaseFieldType: "INT",
                    maximumValue: 99999999999,
                    minimumValue: 0,
                  },
                  customAttributes: '@map("order_number")',
                },
                {
                  permanentId: expect.any(String),
                  name: "theCustomer",
                  displayName: "The Customer",
                  dataType: EnumDataType.Lookup,
                  required: false,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    relatedEntityId: expect.any(String),
                    allowMultipleSelection: false,
                    fkHolder: customerFieldPermanentId,
                    fkFieldName: "customer_id",
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
              customAttributes:
                '@@index([customer_type, customerIdNumber], map: "customer_type_customer_id_number")',
              fields: [
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "@id @default(cuid())",
                },
                {
                  permanentId: expect.any(String),
                  name: "customer_type",
                  displayName: "Customer Type",
                  dataType: EnumDataType.OptionSet,
                  required: false,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    options: [
                      { label: "INDIVIDUAL", value: "INDIVIDUAL" },
                      { label: "COMPANY", value: "COMPANY" },
                    ],
                  },
                  customAttributes: "@default(INDIVIDUAL)",
                },
                {
                  permanentId: expect.any(String),
                  name: "customerIdNumber",
                  displayName: "Customer Id Number",
                  dataType: EnumDataType.WholeNumber,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    databaseFieldType: "INT",
                    maximumValue: 99999999999,
                    minimumValue: 0,
                  },
                  customAttributes: '@map("customer_id_number")',
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });

        it("should format the args in the range @@index attribute in the same way they were formatted in the model fields", async () => {
          // arrange
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Example {
            id    Int @id
            example_value Int
          
            @@index([example_value(ops: Int4BloomOps)], type: Brin)
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
              name: "Example",
              displayName: "Example",
              pluralDisplayName: "Examples",
              description: "",
              customAttributes:
                "@@index([exampleValue(ops: Int4BloomOps)], type: Brin)",
              fields: [
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "AUTO_INCREMENT",
                  },
                  customAttributes: "@id",
                },
                {
                  permanentId: expect.any(String),
                  name: "exampleValue",
                  displayName: "Example Value",
                  dataType: EnumDataType.WholeNumber,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    databaseFieldType: "INT",
                    maximumValue: 99999999999,
                    minimumValue: 0,
                  },
                  customAttributes: '@map("example_value")',
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });
      });

      describe("when we handle a relation field", () => {
        it("should return object with entities and fields with the right relations and a log", async () => {
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
          const customerFieldPermanentId = expect.any(String);
          const result = await service.convertPrismaSchemaForImportObjects(
            prismaSchema,
            existingEntities,
            actionContext
          );

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
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "@id @default(cuid())",
                },
                {
                  permanentId: customerFieldPermanentId,
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
                    fkHolder: customerFieldPermanentId,
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
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "@id @default(cuid())",
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
            `Prisma Schema Validation completed successfully`,
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

        it("should NOT add the `@map` attribute even if we rename the field", async () => {
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Order {
            id         String    @id @default(cuid())
            the_customer   Customer? @relation(fields: [customerId], references: [id])
            customerId String?
          }
          
          model Customer {
            id          String     @id @default(cuid())
            orders      Order[]
          }`;

          const existingEntities: ExistingEntitySelect[] = [];
          const customerFieldPermanentId = expect.any(String);
          const result = await service.convertPrismaSchemaForImportObjects(
            prismaSchema,
            existingEntities,
            actionContext
          );

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
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "@id @default(cuid())",
                },
                {
                  permanentId: customerFieldPermanentId,
                  name: "theCustomer",
                  displayName: "The Customer",
                  dataType: EnumDataType.Lookup,
                  required: false,
                  unique: false,
                  searchable: true,
                  description: "",
                  customAttributes: "",
                  properties: {
                    relatedEntityId: expect.any(String),
                    allowMultipleSelection: false,
                    fkHolder: customerFieldPermanentId,
                    fkFieldName: "customerId",
                  },
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
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "@id @default(cuid())",
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
            `Prisma Schema Validation completed successfully`,
            EnumActionLogLevel.Info
          );
          expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
            3,
            `Prepare Prisma Schema for import`,
            EnumActionLogLevel.Info
          );
          expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
            4,
            `Field name "the_customer" on model Order was changed to "theCustomer"`,
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

        it("should create self relation", async () => {
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Feature {
            id                   String                 @id @default(cuid())
            parentId             String?                
            feature              Feature?               @relation("featureToFeature", fields: [parentId], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "FK_d4a28a8e70d450a412bf0cfb52a")
            otherFeature        Feature[]               @relation("featureToFeature")          
          }`;

          const existingEntities: ExistingEntitySelect[] = [];
          const customerFieldPermanentId = expect.any(String);
          const result = await service.convertPrismaSchemaForImportObjects(
            prismaSchema,
            existingEntities,
            actionContext
          );

          const expectedEntitiesWithFields: CreateBulkEntitiesInput[] = [
            {
              id: expect.any(String),
              name: "Feature",
              displayName: "Feature",
              pluralDisplayName: "Features",
              description: "",
              customAttributes: "",
              fields: [
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "@id @default(cuid())",
                },
                {
                  permanentId: customerFieldPermanentId,
                  name: "feature",
                  displayName: "Feature",
                  dataType: EnumDataType.Lookup,
                  required: false,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    relatedEntityId: expect.any(String),
                    allowMultipleSelection: false,
                    fkHolder: customerFieldPermanentId,
                    fkFieldName: "parentId",
                  },
                  customAttributes: "",
                  relatedFieldAllowMultipleSelection: true,
                  relatedFieldDisplayName: "Other Feature",
                  relatedFieldName: "otherFeature",
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });

        it("should create the models and fields properly when the models have more than one related field to the same model", async () => {
          const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Event {
            id          String   @id @default(uuid())
            event2Id    String?  @unique
            test789     Test[]    @relation(name: "event3")
            tests       Test[]    @relation("event1")
            test456     Test?   @relation(references: [id], fields: [event2Id], map: "FK_event4_event_id")
            test123     Test?    @relation("event2", fields: [event2Id], references: [id])
          }
          
          
          model Test {
            id          String  @id @default(uuid())
            event2      Event[]  @relation(name: "event2")
            event4      Event[]
            event1      Event?  @relation("event1", fields: [event1Id], references: [id])
            event3      Event?  @relation(name: "event3", fields: [event1Id], references: [id], map: "FK_event3_event_id")
            event1Id    String? @unique
          }`;

          const existingEntities: ExistingEntitySelect[] = [];
          const customerFieldPermanentId = expect.any(String);
          const result = await service.convertPrismaSchemaForImportObjects(
            prismaSchema,
            existingEntities,
            actionContext
          );

          const expectedEntitiesWithFields: CreateBulkEntitiesInput[] = [
            {
              id: expect.any(String),
              name: "Event",
              displayName: "Event",
              pluralDisplayName: "Events",
              description: "",
              customAttributes: "",
              fields: [
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "UUID",
                  },
                  customAttributes: "@id @default(uuid())",
                },
                {
                  permanentId: customerFieldPermanentId,
                  name: "test456",
                  displayName: "Test456",
                  dataType: EnumDataType.Lookup,
                  required: false,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    relatedEntityId: expect.any(String),
                    allowMultipleSelection: false,
                    fkHolder: customerFieldPermanentId,
                    fkFieldName: "event2Id",
                  },
                  customAttributes: "",
                  relatedFieldAllowMultipleSelection: true,
                  relatedFieldDisplayName: "Event4",
                  relatedFieldName: "event4",
                },
                {
                  permanentId: customerFieldPermanentId,
                  name: "test123",
                  displayName: "Test123",
                  dataType: EnumDataType.Lookup,
                  required: false,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    relatedEntityId: expect.any(String),
                    allowMultipleSelection: false,
                    fkHolder: customerFieldPermanentId,
                    fkFieldName: "event2Id",
                  },
                  customAttributes: "",
                  relatedFieldAllowMultipleSelection: true,
                  relatedFieldDisplayName: "Event2",
                  relatedFieldName: "event2",
                },
              ],
            },
            {
              id: expect.any(String),
              name: "Test",
              displayName: "Test",
              pluralDisplayName: "Tests",
              description: "",
              customAttributes: "",
              fields: [
                {
                  permanentId: expect.any(String),
                  name: "id",
                  displayName: "Id",
                  dataType: EnumDataType.Id,
                  required: true,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    idType: "UUID",
                  },
                  customAttributes: "@id @default(uuid())",
                },
                {
                  permanentId: customerFieldPermanentId,
                  name: "event1",
                  displayName: "Event1",
                  dataType: EnumDataType.Lookup,
                  required: false,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    relatedEntityId: expect.any(String),
                    allowMultipleSelection: false,
                    fkHolder: customerFieldPermanentId,
                    fkFieldName: "event1Id",
                  },
                  customAttributes: "",
                  relatedFieldAllowMultipleSelection: true,
                  relatedFieldDisplayName: "Tests",
                  relatedFieldName: "tests",
                },
                {
                  permanentId: customerFieldPermanentId,
                  name: "event3",
                  displayName: "Event3",
                  dataType: EnumDataType.Lookup,
                  required: false,
                  unique: false,
                  searchable: true,
                  description: "",
                  properties: {
                    relatedEntityId: expect.any(String),
                    allowMultipleSelection: false,
                    fkHolder: customerFieldPermanentId,
                    fkFieldName: "event1Id",
                  },
                  customAttributes: "",
                  relatedFieldAllowMultipleSelection: true,
                  relatedFieldDisplayName: "Test789",
                  relatedFieldName: "test789",
                },
              ],
            },
          ];
          expect(result).toEqual(expectedEntitiesWithFields);
        });

        describe("when the relation is many to many", () => {
          it("should rename the field but it should NOT add the @map attribute", async () => {
            // arrange
            const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Doctor {
            id          String     @id @default(cuid())
            the_patients    Patient[]  
          }
          
          model Patient {
            id             String          @id @default(cuid())
            the_doctors        Doctor[]       
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
                name: "Doctor",
                displayName: "Doctor",
                pluralDisplayName: "Doctors",
                description: "",
                customAttributes: "",
                fields: [
                  {
                    permanentId: expect.any(String),
                    name: "id",
                    displayName: "Id",
                    dataType: EnumDataType.Id,
                    required: true,
                    unique: false,
                    searchable: true,
                    description: "",
                    properties: {
                      idType: "CUID",
                    },
                    customAttributes: "@id @default(cuid())",
                  },
                  {
                    permanentId: expect.any(String),
                    name: "thePatients",
                    displayName: "The Patients",
                    dataType: EnumDataType.Lookup,
                    required: true,
                    unique: false,
                    searchable: true,
                    description: "",
                    properties: {
                      relatedEntityId: expect.any(String),
                      allowMultipleSelection: true,
                      fkHolder: null,
                      fkFieldName: "",
                    },
                    customAttributes: "",
                    relatedFieldAllowMultipleSelection: true,
                    relatedFieldDisplayName: "The Doctors",
                    relatedFieldName: "theDoctors",
                  },
                ],
              },
              {
                id: expect.any(String),
                name: "Patient",
                displayName: "Patient",
                pluralDisplayName: "Patients",
                description: "",
                customAttributes: "",
                fields: [
                  {
                    permanentId: expect.any(String),
                    name: "id",
                    displayName: "Id",
                    dataType: EnumDataType.Id,
                    required: true,
                    unique: false,
                    searchable: true,
                    description: "",
                    properties: {
                      idType: "CUID",
                    },
                    customAttributes: "@id @default(cuid())",
                  },
                ],
              },
            ];
            expect(result).toEqual(expectedEntitiesWithFields);
          });

          it("should create one side of the relation (the first side that it encounters in the schema)", async () => {
            // arrange
            const prismaSchema = `datasource db {
            provider = "postgresql"
            url      = env("DB_URL")
          }
          
          generator client {
            provider = "prisma-client-js"
          }
          
          model Doctor {
            id          String     @id @default(cuid())
            patients    Patient[]  
          }
          
          model Patient {
            id             String          @id @default(cuid())
            doctors        Doctor[]       
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
                name: "Doctor",
                displayName: "Doctor",
                pluralDisplayName: "Doctors",
                description: "",
                customAttributes: "",
                fields: [
                  {
                    permanentId: expect.any(String),
                    name: "id",
                    displayName: "Id",
                    dataType: EnumDataType.Id,
                    required: true,
                    unique: false,
                    searchable: true,
                    description: "",
                    properties: {
                      idType: "CUID",
                    },
                    customAttributes: "@id @default(cuid())",
                  },
                  {
                    permanentId: expect.any(String),
                    name: "patients",
                    displayName: "Patients",
                    dataType: EnumDataType.Lookup,
                    required: true,
                    unique: false,
                    searchable: true,
                    description: "",
                    properties: {
                      relatedEntityId: expect.any(String),
                      allowMultipleSelection: true,
                      fkHolder: null,
                      fkFieldName: "",
                    },
                    customAttributes: "",
                    relatedFieldAllowMultipleSelection: true,
                    relatedFieldDisplayName: "Doctors",
                    relatedFieldName: "doctors",
                  },
                ],
              },
              {
                id: expect.any(String),
                name: "Patient",
                displayName: "Patient",
                pluralDisplayName: "Patients",
                description: "",
                customAttributes: "",
                fields: [
                  {
                    permanentId: expect.any(String),
                    name: "id",
                    displayName: "Id",
                    dataType: EnumDataType.Id,
                    required: true,
                    unique: false,
                    searchable: true,
                    description: "",
                    properties: {
                      idType: "CUID",
                    },
                    customAttributes: "@id @default(cuid())",
                  },
                ],
              },
            ];
            expect(result).toEqual(expectedEntitiesWithFields);
          });
        });
      });
    });
  });
});
