import { Test } from "@nestjs/testing";
import { PrismaSchemaUtilsService } from "./prismaSchemaUtils.service";
import { ExistingEntitySelect } from "./types";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { CreateBulkEntitiesInput } from "../entity/entity.service";
import { EnumDataType } from "../../enums/EnumDataType";

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
    xit("should return a validation error if the schema is empty", () => {
      throw new Error("Not implemented");
    });
    xit("should return a validation error if the schema is not a valid Prisma schema", () => {
      throw new Error("Not implemented");
    });

    it("should return an object with entities and fields and a log", () => {
      // arrange
      const prismaSchema = `datasource postgres {
        provider = "postgresql"
        url      = env("DB_URL")
      }
      
      generator client {
        provider = "prisma-client-js"
      }
      
      model Admin {
        id         Int   @id @default(autoincrement())
        createdAt  DateTime @default(now())
        username   String   @unique
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
              customAttributes: "@unique",
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
      expect(result).toEqual({
        preparedEntitiesWithFields: expectedEntitiesWithFields,
        log: expect.anything(),
      });
    });
  });
});
