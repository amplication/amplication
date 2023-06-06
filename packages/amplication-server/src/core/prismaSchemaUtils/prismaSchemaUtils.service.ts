import { Inject, Injectable } from "@nestjs/common";
import { validate } from "@prisma/internals";
import {
  getSchema,
  Schema,
  Model,
  Field,
  createPrismaSchemaBuilder,
} from "@mrleebo/prisma-ast";
import {
  capitalizeFirstLetter,
  filterOutAmplicatoinAttributes,
  handleModelName,
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

  getSchema(source: string): Schema {
    const schema = getSchema(source);
    this.logger.debug("Schema", { schema });
    return schema;
  }

  /**
   * Handle all the preparation needed for the schema before converting it to entities
   * @param schema the schema to prepare
   * @returns the prepared schema
   */
  prepareSchema(schema: Schema): Schema {
    this.handleModelMapping(schema);

    return schema;
  }

  prepareEntities(schema: Schema): SchemaEntityFields[] {
    const preparedSchema = this.prepareSchema(schema);
    const entities = preparedSchema.list
      .filter((item: Model) => item.type === "model")
      .map((model: Model) => {
        const modelAttributes = model.properties.filter(
          (prop) => prop.type === "attribute"
        );
        const modelFields = model.properties.filter(
          (prop) => prop.type === "field"
        );

        return {
          name: handleModelName(model.name),
          displayName: handleModelName(model.name),
          pluralDisplayName: pluralize(capitalizeFirstLetter(model.name)),
          pluralName: pluralize(model.name.toLowerCase()),
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

    this.logger.debug("Entities", { entities });
    return entities;
  }

  /**
   * add "@@map" attribute to model name if its name is plural
   * @param schema
   * @returns
   */
  private handleModelMapping(schema: Schema): Schema {
    const models = schema.list.filter((item) => item.type === "model");
    models.map((model: Model) => {
      if (pluralize.isPlural(model.name)) {
        const schemaString = schema.toString();
        const builder = createPrismaSchemaBuilder(schemaString);
        builder.model(model.name).blockAttribute(`@@map${model.name}`);
        return builder.getSchema();
      }
    });
    return schema;
  }

  /**
   * convert model names from snake_case to PascalCase
   * @param schema
   */
  private handleSnakeCase(schema: Schema): Schema {
    const models = schema.list.filter((item) => item.type === "model");
    models.map((model: Model) => {
      if (model.name.includes("_")) {
        const schemaString = schema.toString();
        const builder = createPrismaSchemaBuilder(schemaString);
        builder.model(model.name).blockAttribute(`@@map${model.name}`);
        const snakeCaseName = model.name;
        const pascalCaseName = snakeCaseName
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join("");
        builder.model(pascalCaseName).blockAttribute(`@@map${pascalCaseName}`);
        return builder.getSchema();
      }
    });
    return schema;
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
