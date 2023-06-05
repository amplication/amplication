import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { validate } from "@prisma/internals";
import { getSchema, Schema, Model, Field, Func } from "@mrleebo/prisma-ast";
import {
  capitalizeFirstLetter,
  filterOutAmplicatoinAttributes,
  prepareModelAttributes,
} from "./schema-utils";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import pluralize from "pluralize";
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
    description: string;
    dataType: string | Func;
    required: boolean;
    unique: boolean;
    searchable: boolean;
    properties: Record<string, unknown>;
    customAttributes: string[];
  }[];
};

@Injectable()
export class PrismaSchemaUtilsService {
  prismaSchemaUploadsFolder: string;
  constructor(
    private readonly configService: ConfigService,
    @Inject(AmplicationLogger) private readonly logger: AmplicationLogger
  ) {
    this.prismaSchemaUploadsFolder = configService.get(
      Env.PRISMA_SCHEMA_UPLOAD_FOLDER
    );
  }

  validateSchemaOnUpload(file: string): void {
    const schemaString = file.replace(/\\n/g, "\n");
    try {
      validate({ datamodel: schemaString });
      this.logger.info("Valid schema");
    } catch (error) {
      this.logger.error("Invalid schema", error);
      throw new Error("Invalid schema");
    }
  }

  async getSchema(source: string): Promise<Schema> {
    const schema = getSchema(source);
    this.logger.debug("Schema", { schema });
    return schema;
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
              description: "",
              required: field.optional,
              unique: field.attributes?.some((attr) => attr.name === "unique"),
              searchable: false, // TODO: check if searchable and not hardcoded
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

  /**
   *  TODO: add schema validation
   * for example, check that the schema has at least one model, doesn't have duplicate models, enums, etc.
   * return a list of errors
   *
   */
}
