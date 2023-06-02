import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Express } from "express";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from "multer";
import { promises as fs } from "fs";
import { getSchema, Schema, Model, Field, Func } from "@mrleebo/prisma-ast";
import path from "path";
import pluralize from "pluralize";
import {
  capitalizeFirstLetter,
  filterOutAmplicatoinAttributes,
  prepareModelAttributes,
} from "./schema-utils";
import { validate } from "@prisma/internals";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Env } from "../../env";

type SchemaEntityFields = {
  name: string;
  displayName: string;
  pluralDisplayName: string;
  pluralName: string;
  description: string | null;
  customAttributes: string[];
  fields: {
    name: string;
    displayName: string;
    dataType: string | Func;
    required: boolean;
    unique: boolean;
    properties: Record<string, unknown>;
    customAttributes: string[];
  }[];
};

@Injectable()
export class PrismaSchemaImportService {
  prismaSchemaUploadsFolder: string;
  constructor(
    private readonly configService: ConfigService,
    @Inject(AmplicationLogger) private readonly logger: AmplicationLogger
  ) {
    this.prismaSchemaUploadsFolder = configService.get(
      Env.PRISMA_SCHEMA_UPLOAD_FOLDER
    );
  }

  async saveFile(
    file: Express.Multer.File,
    resourceId: string
  ): Promise<string> {
    this.validateSchema(file);
    const rootDir = process.cwd();
    await fs.mkdir(
      `${rootDir}/${this.prismaSchemaUploadsFolder}/${resourceId}`,
      {
        recursive: true,
      }
    );
    const writeDir = `${rootDir}/${this.prismaSchemaUploadsFolder}/${resourceId}/${file.originalname}`;

    try {
      await fs.writeFile(writeDir, file.buffer);
      return writeDir;
    } catch (error) {
      this.logger.error("Failed to save prisma schema", error);
      throw error;
    }
  }

  validateSchema(file: Express.Multer.File): void {
    const schemaString = file.buffer.toString("utf-8").replace(/\\n/g, "\n");
    try {
      validate({ datamodel: schemaString });
      this.logger.info("Valid schema");
    } catch (error) {
      this.logger.error("Invalid schema", error);
      throw new Error("Invalid schema");
    }
  }

  async getSchema(filePath: string): Promise<Schema> {
    const source = await fs.readFile(filePath, {
      encoding: "utf8",
    });
    return getSchema(source);
  }

  prepareSchema(schema: Schema): SchemaEntityFields[] {
    const entities = schema.list
      .filter((item: Model) => item.type === "model")
      .map((item: Model) => {
        const modelAttributes = item.properties.filter(
          (prop) => prop.type === "attribute"
        );
        const modelFields = item.properties.filter(
          (prop) => prop.type === "field"
        );

        return {
          name: item.name,
          displayName: capitalizeFirstLetter(item.name),
          pluralDisplayName: pluralize(capitalizeFirstLetter(item.name)),
          pluralName: pluralize(item.name.toLowerCase()),
          description: null,
          customAttributes: prepareModelAttributes(modelAttributes),
          fields: modelFields.map((field: Field) => {
            return {
              name: field.name,
              displayName: capitalizeFirstLetter(field.name),
              dataType: field.fieldType,
              required: field.optional,
              unique: field.attributes?.some((attr) => attr.name === "unique"),
              properties: {},
              customAttributes: filterOutAmplicatoinAttributes(
                prepareModelAttributes(field.attributes)
              ),
            };
          }),
        };
      });

    return entities;
  }

  async saveAsJsonSchema(schemaObj: object, filePath: string) {
    const fileDir = path.dirname(filePath);
    const fileName = path.basename(filePath, ".prisma");
    try {
      await fs.writeFile(
        `${fileDir}/${fileName}.json`,
        JSON.stringify(schemaObj, null, 2)
      );
    } catch (err) {
      this.logger.error(err);
    }
  }

  /**
   *  TODO: add schema validation
   * for example, check that the schema has at least one model, doesn't have duplicate models, enums, etc.
   * return a list of errors
   *
   */
}
