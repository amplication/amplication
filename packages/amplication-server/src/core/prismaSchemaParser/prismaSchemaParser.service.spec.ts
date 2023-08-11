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
                searchable: false,
                description: "",
                properties: {
                  idType: "AUTO_INCREMENT",
                },
                customAttributes: "",
              },
              {
                permanentId: expect.any(String),
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
                permanentId: expect.any(String),
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
                permanentId: expect.any(String),
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

      it("should NOT have the '@default' attribute as a custom attribute if it is an id field", async () => {
        // arrange
        const prismaSchema = `datasource db {
          provider = "postgresql"
          url      = env("DB_URL")
        }
        
        generator client {
          provider = "prisma-client-js"
        }
        
        model Example {
          id    Int @id @default(0)
          value Int    @default(123)    
        }

        model Test {
          test_id    String @id @default("mock_id")
          value2 Int        
        }
        `;
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
            customAttributes: "",
            fields: [
              {
                permanentId: expect.any(String),
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
                permanentId: expect.any(String),
                name: "value",
                displayName: "Value",
                dataType: EnumDataType.WholeNumber,
                required: true,
                unique: false,
                searchable: false,
                description: "",
                properties: {
                  maximumValue: 99999999999,
                  minimumValue: 0,
                },
                customAttributes: "@default(123)",
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
                searchable: false,
                description: "",
                properties: {
                  idType: "CUID",
                },
                customAttributes: '@map("test_id")',
              },
              {
                permanentId: expect.any(String),
                name: "value2",
                displayName: "Value2",
                dataType: EnumDataType.WholeNumber,
                required: true,
                unique: false,
                searchable: false,
                description: "",
                properties: {
                  maximumValue: 99999999999,
                  minimumValue: 0,
                },
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
                searchable: false,
                description: "",
                properties: {
                  idType: "AUTO_INCREMENT",
                },
                customAttributes: "",
              },
              {
                permanentId: expect.any(String),
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
                permanentId: expect.any(String),
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
                permanentId: expect.any(String),
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
                searchable: false,
                description: "",
                properties: {
                  idType: "AUTO_INCREMENT",
                },
                customAttributes: "",
              },
              {
                permanentId: expect.any(String),
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
                permanentId: expect.any(String),
                name: "superPower",
                displayName: "Super Power",
                dataType: EnumDataType.SingleLineText,
                required: true,
                unique: false,
                searchable: false,
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
                searchable: false,
                description: "",
                properties: {
                  idType: "AUTO_INCREMENT",
                },
                customAttributes: "",
              },
              {
                permanentId: expect.any(String),
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
                permanentId: expect.any(String),
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
                permanentId: expect.any(String),
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

      describe("when model has @@index/@@id/@@unique attributes", () => {
        it("should convert @@id attribute to @@unique attribute and add id field to the model", async () => {
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
                  searchable: false,
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
                  searchable: false,
                  description: "",
                  properties: {
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
                  searchable: false,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "",
                },
                {
                  permanentId: expect.any(String),
                  name: "firstName",
                  displayName: "First Name",
                  dataType: EnumDataType.SingleLineText,
                  required: true,
                  unique: false,
                  searchable: false,
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
                  searchable: false,
                  description: "",
                  properties: {
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
            id          Int     @id @default(cuid())
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
                  searchable: false,
                  description: "",
                  properties: {
                    idType: "AUTO_INCREMENT",
                  },
                  customAttributes: "",
                },
                {
                  permanentId: expect.any(String),
                  name: "customerType",
                  displayName: "Customer Type",
                  dataType: EnumDataType.SingleLineText,
                  required: true,
                  unique: false,
                  searchable: false,
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
                  searchable: false,
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
                  searchable: false,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "",
                },
                {
                  permanentId: expect.any(String),
                  name: "orderNumber",
                  displayName: "Order Number",
                  dataType: EnumDataType.WholeNumber,
                  required: true,
                  unique: false,
                  searchable: false,
                  description: "",
                  properties: {
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
                  searchable: false,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "",
                },
                {
                  permanentId: expect.any(String),
                  name: "customer_type",
                  displayName: "Customer Type",
                  dataType: EnumDataType.OptionSet,
                  required: false,
                  unique: false,
                  searchable: false,
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
                  searchable: false,
                  description: "",
                  properties: {
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
                  searchable: false,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "",
                },
                {
                  permanentId: expect.any(String),
                  name: "orderNumber",
                  displayName: "Order Number",
                  dataType: EnumDataType.WholeNumber,
                  required: true,
                  unique: false,
                  searchable: false,
                  description: "",
                  properties: {
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
                  searchable: false,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "",
                },
                {
                  permanentId: expect.any(String),
                  name: "customer_type",
                  displayName: "Customer Type",
                  dataType: EnumDataType.OptionSet,
                  required: false,
                  unique: false,
                  searchable: false,
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
                  searchable: false,
                  description: "",
                  properties: {
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
                  searchable: false,
                  description: "",
                  properties: {
                    idType: "AUTO_INCREMENT",
                  },
                  customAttributes: "",
                },
                {
                  permanentId: expect.any(String),
                  name: "exampleValue",
                  displayName: "Example Value",
                  dataType: EnumDataType.WholeNumber,
                  required: true,
                  unique: false,
                  searchable: false,
                  description: "",
                  properties: {
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
                  searchable: false,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "",
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
                  searchable: false,
                  description: "",
                  properties: {
                    idType: "CUID",
                  },
                  customAttributes: "",
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
                    searchable: false,
                    description: "",
                    properties: {
                      idType: "CUID",
                    },
                    customAttributes: "",
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
                    searchable: false,
                    description: "",
                    properties: {
                      idType: "CUID",
                    },
                    customAttributes: "",
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
          });
        });
      });

      it("should replace the group attribute name to the provider name", async () => {
        // arrange
        const prismaSchema = `datasource db {
          provider = "postgresql"
          url      = env("DB_URL")
        }
        
        generator client {
          provider = "prisma-client-js"
        }

        model Admin {
          id          Int     @id @default(cuid())
          name        String @db.VarChar(255)
        }
        `;
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
                searchable: false,
                description: "",
                properties: {
                  idType: "AUTO_INCREMENT",
                },
                customAttributes: "",
              },
              {
                permanentId: expect.any(String),
                name: "name",
                displayName: "Name",
                dataType: EnumDataType.SingleLineText,
                required: true,
                unique: false,
                searchable: false,
                description: "",
                properties: {
                  maxLength: 256,
                },
                customAttributes: "@postgresql.VarChar(255)",
              },
            ],
          },
        ];
        expect(result).toEqual(expectedEntitiesWithFields);
      });
    });
  });
});
