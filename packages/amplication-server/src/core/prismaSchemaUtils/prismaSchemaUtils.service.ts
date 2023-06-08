import { Inject, Injectable } from "@nestjs/common";
import { validate } from "@prisma/internals";
import {
  getSchema,
  Model,
  Field,
  createPrismaSchemaBuilder,
  ConcretePrismaSchemaBuilder,
  Schema,
} from "@mrleebo/prisma-ast";
import {
  filterOutAmplicationAttributes,
  handleModelName,
  idTypePropertyMap,
} from "./schema-utils";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import pluralize from "pluralize";
import {
  CreateEntityFieldInput,
  CreateEntityInput,
  ErrorLevel,
  ErrorMessages,
  Operation,
  SchemaEntityFields,
} from "./types";
import { ErrorMessage } from "./ErrorMessages";

@Injectable()
export class PrismaSchemaUtilsService {
  private operations: Operation[] = [
    this.handleModelNamesRenaming,
    this.handleFieldNamesRenaming,
    this.handleIdField,
  ];

  constructor(
    @Inject(AmplicationLogger) private readonly logger: AmplicationLogger
  ) {}

  /**
   * Validate schema by Prisma
   * @param file - the schema file that was uploaded
   * @throws - if the schema is invalid
   * @returns - void
   **/
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

  /**
   * Prepare schema before passing it to entities and fields creation
   * @param operations - functions with a declared interface (builder: ConcretePrismaSchemaBuilder) => ConcretePrismaSchemaBuilder
   * The functions are called one after the other and perform operations on the schema
   * The functions have a name pattern: handle{OperationName}
   * @returns  - function that accepts the initial schema and returns the prepared schema
   */
  prepareSchema =
    (...operations: Operation[]) =>
    (initialSchema: string): Schema => {
      let builder = createPrismaSchemaBuilder(initialSchema);

      operations.forEach((operation) => {
        builder = operation.call(this, builder);
      });

      this.logger.debug(
        "Generated Prisma schema",
        { schema: builder.getSchema() },
        PrismaSchemaUtilsService.name
      );
      return builder.getSchema();
    };

  /**
   * ************************************************
   * Two ways to use the prepare entities and fields:
   * ************************************************
   * 1. prepareEntitiesWithFields - get a schema as a string, call prepareSchema with the operations array,
   *    and returns an array of the entities with their fields.
   *    To create Amplication entities with their fields, you can use this function only
   *
   * 2. prepareEntities - get a schema as a string, call prepareSchema with the operations array,
   *    and returns an array of the entities without their fields.
   *    To create Amplication entities with their fields, you will need to use also prepareEntitiesFields.
   *
   * 3. prepareEntitiesFields - get a schema as a string, call prepareSchema with the operations array,
   *    and returns an object of the entities as a key (string, without the entity data) and their fields as a value.
   *   To create Amplication entities with their fields, you will need to use also prepareEntities.
   */

  prepareEntitiesWithFields(schema: string): SchemaEntityFields[] {
    const preparedSchema = this.prepareSchema(...this.operations)(schema);
    const preparedEntities = preparedSchema.list
      .filter((item: Model) => item.type === "model")
      .map((model: Model) => {
        const entity = this.prepareEntity(model);
        const fields = this.prepareEntityFields(schema, model);

        const preparedEntityWithFields: SchemaEntityFields = {
          ...entity,
          fields: fields,
        };

        return preparedEntityWithFields;
      });

    return preparedEntities;
  }

  prepareEntity(model: Model): CreateEntityInput {
    const modelAttributes = model.properties.filter(
      (prop) => prop.type === "attribute"
    );
    const entityPluralDisplayName = pluralize(model.name);
    const entityAttributes = this.prepareAttributes(modelAttributes).join(" ");

    return {
      name: model.name,
      displayName: model.name,
      pluralDisplayName: entityPluralDisplayName,
      description: null,
      customAttributes: entityAttributes,
    };
  }

  private prepareEntityFields(
    schema: string,
    model: Model
  ): CreateEntityFieldInput[] {
    const modelFields = model.properties.filter(
      (prop) => prop.type === "field"
    );

    return modelFields.map((field: Field) => {
      const fieldDataType = this.prepareFieldDataType(schema, field);
      const isUniqueField = field.attributes?.some(
        (attr) => attr.name === "unique"
      );
      const fieldProperties = this.prepareFiledProperties(field);
      const fieldAttributes = filterOutAmplicationAttributes(
        this.prepareAttributes(field.attributes)
      ).join(" ");

      return {
        name: field.name,
        displayName: field.name,
        dataType: fieldDataType,
        required: field.optional,
        unique: isUniqueField,
        searchable: false,
        description: null,
        properties: fieldProperties,
        customAttributes: fieldAttributes,
      };
    });
  }

  /**
   * add "@@map" attribute to model name if its name is plural or snake case
   * and rename model name to singular and in pascal case
   * @param builder - prisma schema builder
   * @returns
   */
  private handleModelNamesRenaming(
    builder: ConcretePrismaSchemaBuilder
  ): ConcretePrismaSchemaBuilder {
    const schema = builder.getSchema();
    const models = schema.list.filter((item) => item.type === "model");
    models.map((model: Model) => {
      const isInvalidModelName =
        pluralize.isPlural(model.name) ||
        model.name.includes("_") ||
        !/^[A-Z]/.test(model.name);

      if (isInvalidModelName) {
        builder.model(model.name).blockAttribute("map", model.name);
        builder.model(model.name).then<Model>((model) => {
          model.name = handleModelName(model.name);
        });
        return builder;
      }
    });
    return builder;
  }

  /**
   * Add "@map" attribute to field name if its name is in snake case and it does not have "@id" attribute
   * Then, rename field name to camel case
   * @param builder - prisma schema builder
   * @returns the new builder if there was a change or the old one if there was no change
   */
  private handleFieldNamesRenaming(
    builder: ConcretePrismaSchemaBuilder
  ): ConcretePrismaSchemaBuilder {
    const schema = builder.getSchema();
    const models = schema.list.filter((item) => item.type === "model");
    models.map((model: Model) => {
      const fields = model.properties.filter(
        (property) =>
          property.type === "field" &&
          !property.attributes?.some((attr) => attr.name === "id")
      ) as Field[];
      fields.map((field: Field) => {
        const isInvalidFieldName = field.name.includes("_");
        if (isInvalidFieldName) {
          builder
            .model(model.name)
            .field(field.name)
            .attribute("map", [field.name]);
          builder
            .model(model.name)
            .field(field.name)
            .then<Field>((field) => {
              field.name = handleFieldName(field.name);
            });
          return builder;
        }
      });
    });
    return builder;
  }

  /**
   * search for the id of the table (decorated with @id) and if it is not named "id" rename it to "id" and add "@map" attribute
   * @param builder - prisma schema builder
   */
  private handleIdField(
    builder: ConcretePrismaSchemaBuilder
  ): ConcretePrismaSchemaBuilder {
    const schema = builder.getSchema();
    const models = schema.list.filter((item) => item.type === "model");

    models.map((model: Model) => {
      const idField = model.properties.find(
        (property) =>
          property.type === "field" &&
          property.attributes?.some((attr) => attr.name === "id")
      ) as Field;

      if (idField && idField.name !== "id") {
        builder
          .model(model.name)
          .field(idField.name)
          .attribute("map", [idField.name]);
        builder
          .model(model.name)
          .field(idField.name)
          .then<Field>((field) => {
            field.name = "id";
          });

        return builder;
      }
    });
    return builder;
  }

  private prepareFieldDataType(schema: string, field: Field): EnumDataType {
    const schemaObject = getSchema(schema);
    const fieldIdType = field.attributes?.find(
      (attribute) => attribute.name === "id"
    );
    if (fieldIdType) {
      return EnumDataType.Id;
    }

    const fieldLookupType = field.attributes?.find(
      (attribute) => attribute.name === "relation"
    );
    if (fieldLookupType) {
      return EnumDataType.Lookup;
    }

    const modelList = schemaObject.list.filter((item) => item.type === "model");
    const fieldModelType = modelList.find(
      (modelItem: Model) =>
        handleModelName(modelItem.name).toLowerCase() ===
        pluralize.singular(handleFieldName(field.fieldType)).toLowerCase()
    );
    if (fieldModelType) {
      return EnumDataType.Lookup;
    }

    const enumList = schemaObject.list.filter((item) => item.type === "enum");
    const fieldOptionSetType = enumList.find(
      (enumItem: Enum) => enumItem.name === field.fieldType
    );
    if (fieldOptionSetType) {
      return EnumDataType.OptionSet;
    }

    switch (field.fieldType) {
      case ScalarType.String:
        return EnumDataType.SingleLineText;
      case ScalarType.Int:
        return EnumDataType.WholeNumber;
      case ScalarType.Float:
        return EnumDataType.DecimalNumber;
      case ScalarType.Boolean:
        return EnumDataType.Boolean;
      case ScalarType.DateTime:
        return EnumDataType.DateTime;
      case ScalarType.Json:
        return EnumDataType.Json;
      default:
        throw new Error(`Unsupported data type: ${field.fieldType}`);
    }
  }

  /**
   * take the model or field attributes from the schema object and translate it to array of strings like Amplication expects
   * @param attributes
   * @returns array of strings representing the attributes
   */
  private prepareAttributes(attributes): string[] {
    if (!attributes && !attributes?.length) {
      return [];
    }
    return attributes.map((attribute) => {
      if (!attribute.args && !attribute.args?.length) {
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

  private prepareFiledProperties(field) {
    const defaultIdAttribute = field.attributes?.find(
      (attr) => attr.name === "default"
    );
    if (!defaultIdAttribute) return;
    return idTypePropertyMap[defaultIdAttribute.args[0].value.name];
  }

  /**
   * Get the schema as a string after the upload and validate it against the schema validation rules for models and fields
   * @param schema schema string
   * @returns array of errors if there are any or null if there are no errors
   */
  validateSchemaProcessing(schema: string): ErrorMessage[] | null {
    const schemaObject = getSchema(schema);
    const errors: ErrorMessage[] = [];
    const models = schemaObject.list.filter(
      (item: Model) => item.type === "model"
    );

    if (models.length === 0) {
      errors.push({
        message: ErrorMessages.NoModels,
        level: ErrorLevel.Error,
        details: "A schema must contain at least one model",
      });
    }

    models.map((model: Model) => {
      const invalidModelNameErrors = this.validateModelName(model.name);

      if (invalidModelNameErrors) {
        errors.push(...invalidModelNameErrors);
      }

      const fields = model.properties.filter(
        (property) => property.type === "field"
      ) as Field[];

      fields.map((field: Field) => {
        const invalidFieldNameErrors = this.validateFieldName(field.name);
        if (invalidFieldNameErrors) {
          errors.push(...invalidFieldNameErrors);
        }
      });
    });

    return errors.length > 0 ? errors : null;
  }

  validateModelName(modelName: string): ErrorMessage[] | null {
    const errors: ErrorMessage[] = [];
    // Define the regular expression
    const modelNameRegex = /^[A-Za-z][A-Za-z0-9_]*$/;
    if (!modelNameRegex.test(modelName)) {
      errors.push({
        message: ErrorMessages.InvalidModelName,
        level: ErrorLevel.Error,
        details: `ModelName: "${modelName}" must adhere to the following regular expression: [A-Za-z][A-Za-z0-9_]*`,
      });
      this.logger.error(
        `Model name "${modelName}" must adhere to the following regular expression: [A-Za-z][A-Za-z0-9_]*`,
        null,
        PrismaSchemaUtilsService.name
      );
      return errors;
    }
  }

  validateFieldName(modelName: string): ErrorMessage[] | null {
    const errors: ErrorMessage[] = [];
    // Define the regular expression
    const modelNameRegex = /^[A-Za-z][A-Za-z0-9_]*$/;
    if (!modelNameRegex.test(modelName)) {
      errors.push({
        message: ErrorMessages.InvalidModelName,
        level: ErrorLevel.Error,
        details: `modelName: "${modelName}" must adhere to the following regular expression: [A-Za-z][A-Za-z0-9_]*`,
      });
      this.logger.error(
        `Model name "${modelName}" must adhere to the following regular expression: [A-Za-z][A-Za-z0-9_]*`,
        null,
        PrismaSchemaUtilsService.name
      );
      return errors;
    }
  }
}
