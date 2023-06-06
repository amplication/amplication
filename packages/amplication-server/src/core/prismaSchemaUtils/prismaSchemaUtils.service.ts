import { Inject, Injectable } from "@nestjs/common";
import { validate } from "@prisma/internals";
import { getSchema, Schema, Model, Field } from "@mrleebo/prisma-ast";
import {
  capitalizeFirstLetter,
  filterOutAmplicatoinAttributes,
  idTypePropertyMap,
} from "./schema-utils";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import pluralize from "pluralize";
import { ErrorLevel, ErrorMessages, SchemaEntityFields } from "./types";
import { ErrorMessage } from "./ErrorMessages";

@Injectable()
export class PrismaSchemaUtilsService {
  constructor(
    @Inject(AmplicationLogger) private readonly logger: AmplicationLogger
  ) {}

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
          customAttributes: this.prepareModelAttributes(modelAttributes),
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
                this.prepareModelAttributes(field.attributes)
              ),
            };
          }),
        };
      });

    return entities;
  }

  private prepareModelAttributes(attributes) {
    if (!attributes && !attributes?.length) {
      return [];
    }
    return attributes.map((attribute) => {
      if (!attribute.arg && !attribute.args?.length) {
        return attribute.kind === "model"
          ? `@@${attribute.name}`
          : `@${attribute.name}`;
      }
      const args = attribute.args.map((arg) => {
        if (typeof arg.value === "object" && arg.value !== null) {
          if (arg.value.type === "array") {
            return `[${arg.value.args.join(", ")}]`;
          } else if (arg.value.type === "keyValue") {
            return `${arg.value.key}: ${arg.value.value}`;
          }
        } else {
          return arg.value;
        }
      });

      return `${attribute.kind === "model" ? "@@" : "@"}${
        attribute.name
      }(${args.join(", ")})`;
    });
  }

  private createAmplcationFiledProperties(field) {
    const defaultIdAttribute = field.attributes?.find(
      (attr) => attr.name === "default"
    );
    if (!defaultIdAttribute) return;
    return idTypePropertyMap[defaultIdAttribute.args[0].value.name];
  }

  validateSchemaProcessing(schema: Schema): ErrorMessage[] | null {
    const errors: ErrorMessage[] = [];
    const models = schema.list.filter((item: Model) => item.type === "model");

    if (models.length === 0) {
      errors.push({
        message: ErrorMessages.NoModels,
        level: ErrorLevel.Error,
        details: "A schema must contain at least one model",
      });
    }

    return errors.length > 0 ? errors : null;
  }

  validateSchemaUpload(file: string): void {
    const schemaString = file.replace(/\\n/g, "\n");
    try {
      validate({ datamodel: schemaString });
      this.logger.info("Valid schema");
    } catch (error) {
      this.logger.error("Invalid schema", error);
      throw new Error("Invalid schema");
    }
  }
}
