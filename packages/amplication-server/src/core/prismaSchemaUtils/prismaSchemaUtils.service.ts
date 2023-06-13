import { Inject, Injectable } from "@nestjs/common";
import { validate } from "@prisma/internals";
import {
  getSchema,
  Model,
  Field,
  createPrismaSchemaBuilder,
  ConcretePrismaSchemaBuilder,
  Schema,
  Enum,
  AttributeArgument,
  KeyValue,
  RelationArray,
  Func,
  Enumerator,
} from "@mrleebo/prisma-ast";
import {
  filterOutAmplicationAttributes,
  formatDisplayName,
  formatFieldName,
  formatModelName,
  idTypePropertyMap,
} from "./schema-utils";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import pluralize from "pluralize";
import {
  CreateEntityInput,
  ErrorLevel,
  ErrorMessages,
  Operation,
} from "./types";
import { ErrorMessage } from "./ErrorMessages";
import { ScalarType } from "prisma-schema-dsl-types";
import { EnumDataType } from "../../enums/EnumDataType";

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
   * Prepare schema before passing it to entities and fields creation
   * @param operations functions with a declared interface (builder: ConcretePrismaSchemaBuilder) => ConcretePrismaSchemaBuilder
   * The functions are called one after the other and perform operations on the schema
   * The functions have a name pattern: handle{OperationName}
   * @returns function that accepts the initial schema and returns the prepared schema
   */
  processSchema(...operations: Operation[]): (inputSchema: string) => Schema {
    return (inputSchema: string): Schema => {
      let builder = createPrismaSchemaBuilder(inputSchema);

      operations.forEach((operation) => {
        builder = operation.call(this, builder);
      });

      return builder.getSchema();
    };
  }

  convertPrismaSchemaForImportObjects(schema: string): CreateEntityInput[] {
    const preparedSchema = this.processSchema(...this.operations)(schema);
    return this.convertPreparedSchemaForImportObjects(preparedSchema);
  }

  convertPreparedSchemaForImportObjects(schema: Schema): CreateEntityInput[] {
    const preparedEntities = schema.list
      .filter((item: Model) => item.type === "model")
      .map((model: Model) => this.prepareEntity(model));

    schema.list
      .filter((item: Model) => item.type === "model")
      .forEach((model: Model) => {
        model.properties
          .filter((property) => property.type === "field")
          .forEach((field: Field) => {
            if (this.isFkFieldOfARelation(schema, field)) return;
            if (this.isNotAnnotatedRelationField(schema, field)) return;

            if (this.isBooleanField(schema, field)) {
              this.convertPrismaBooleanToEntityField(
                schema,
                model,
                field,
                preparedEntities
              );
            }

            if (this.isDateTimeField(schema, field)) {
              this.convertPrismaDateTimeToEntityField(
                schema,
                model,
                field,
                preparedEntities
              );
            }

            if (this.isDecimalNumberField(schema, field)) {
              this.convertPrismaDecimalNumberToEntityField(
                schema,
                model,
                field,
                preparedEntities
              );
            }

            if (this.isWholeNumberField(schema, field)) {
              this.convertPrismaWholeNumberToEntityField(
                schema,
                model,
                field,
                preparedEntities
              );
            }

            if (this.isSingleLineTextField(schema, field)) {
              this.convertPrismaSingleLineTextToEntityField(
                schema,
                model,
                field,
                preparedEntities
              );
            }
            // TODO: text - multi line (?)

            if (this.isJsonField(schema, field)) {
              this.convertPrismaJsonToEntityField(
                schema,
                model,
                field,
                preparedEntities
              );
            }

            if (this.isIdField(schema, field)) {
              this.convertPrismaIdToEntityField(
                schema,
                model,
                field,
                preparedEntities
              );
            }

            if (this.isOptionSetField(schema, field)) {
              this.convertPrismaOptionSetToEntityField(
                schema,
                model,
                field,
                preparedEntities
              );
            }

            if (this.isMultiSelectOptionSetField(schema, field)) {
              this.convertPrismaMultiSelectOptionSetToEntityField(
                schema,
                model,
                field,
                preparedEntities
              );
            }

            if (this.isLookupField(schema, field)) {
              this.convertPrismaLookupToEntityField(
                schema,
                model,
                field,
                preparedEntities
              );
            }

            /*******************************************************************
             * fields that doesn't have properties and we don't catch their type
             if (isCreatedAtField(field)) {}
             if (isUpdatedAtField(field)) {}
             if (isEmailField(field)) {}
             if (isPasswordField(field)) {}
             if (isUsernameField(field)) {}
             if (isRolesField(field)) {}
             if (isGeographicLocationField(field)) {}
             *******************************************************************/
          });
      });
    return preparedEntities;
  }

  /*****************************
   * PREPARE FUNCTIONS SECTION *
   *****************************/

  /**
   * Prepare an entity in a form of EntityCreateInput
   * @param model the model to prepare
   * @returns entity in a structure like in EntityCreateInput
   */
  private prepareEntity(model: Model): CreateEntityInput {
    const modelDisplayName = formatDisplayName(model.name);
    const modelAttributes = model.properties.filter(
      (prop) => prop.type === "attribute"
    );
    const entityPluralDisplayName = pluralize(model.name);
    const entityAttributes = this.prepareAttributes(modelAttributes).join(" ");

    return {
      name: model.name,
      displayName: modelDisplayName,
      pluralDisplayName: entityPluralDisplayName,
      description: null,
      customAttributes: entityAttributes,
      fields: [],
    };
  }

  private prepareEntityFieldsByType(field: Field, fieldDataType: EnumDataType) {
    const fieldDisplayName = formatDisplayName(field.name);
    const isUniqueField = field.attributes?.some(
      (attr) => attr.name === "unique"
    );

    const fieldAttributes = filterOutAmplicationAttributes(
      this.prepareAttributes(field.attributes)
    ).join(" ");

    return {
      name: field.name,
      displayName: fieldDisplayName,
      dataType: fieldDataType,
      required: field.optional || false,
      unique: isUniqueField,
      searchable: false,
      description: null,
      properties: {},
      customAttributes: fieldAttributes,
    };
  }

  /**
   * Loop over fieldTypCases and return the first one that matches the field type, if none matches,
   * it will get to the last one - which is an error, an return it
   * @param schema the schema (string) to perform the operation on
   * @param field the field to on which to determine the data type
   * @returns the data type of the field
   */
  private resolveFieldDataType(schema: Schema, field: Field): EnumDataType {
    const idType = () => {
      const fieldIdType = field.attributes?.some(
        (attribute) => attribute.name === "id"
      );
      if (fieldIdType) {
        return EnumDataType.Id;
      }
    };

    const lookupRelationType = () => {
      const fieldLookupType = field.attributes?.some(
        (attribute) => attribute.name === "relation"
      );
      if (fieldLookupType) {
        return EnumDataType.Lookup;
      }
    };

    const optionSetType = () => {
      const enumList = schema.list.filter((item) => item.type === "enum");
      const fieldOptionSetType = enumList.find(
        (enumItem: Enum) => enumItem.name === field.fieldType
      );
      if (fieldOptionSetType) {
        return EnumDataType.OptionSet;
      }
    };

    const multiSelectOptionSetType = () => {
      const enumList = schema.list.filter((item) => item.type === "enum");
      const fieldOptionSetType = enumList.find(
        (enumItem: Enum) =>
          enumItem.name === field.fieldType && field.name.includes("[]")
      );
      if (fieldOptionSetType) {
        return EnumDataType.MultiSelectOptionSet;
      }
    };

    const scalarType = () => {
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
      }
    };

    const fieldDataTypCases: (() => EnumDataType | undefined)[] = [
      idType,
      lookupRelationType,
      optionSetType,
      multiSelectOptionSetType,
      // must be the one before the last
      scalarType,
      // must be last
      () => {
        throw new Error(`Unsupported data type: ${field.fieldType}`);
      },
    ];

    for (const fieldDataTypCase of fieldDataTypCases) {
      const result = fieldDataTypCase();
      if (result) {
        return result;
      }
    }
  }

  /**
   * Take the model or field attributes from the schema object and translate it to array of strings like Amplication expects
   * @param attributes the attributes to prepare and convert from the AST form to array of strings
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

  private prepareRelations(
    model: Model,
    field: Field
  ): { relatedFieldName: string; relatedFieldDisplayName: string } {
    const relationAttribute = field.attributes?.find(
      (attr) => attr.name === "relation"
    );

    if (!relationAttribute) return;

    return {
      relatedFieldName: model.name,
      relatedFieldDisplayName: formatDisplayName(model.name),
    };
  }

  /************************
   * FIELD DATA TYPE CHECKS *
   ************************/

  private isSingleLineTextField(schema: Schema, field: Field): boolean {
    return (
      this.resolveFieldDataType(schema, field) === EnumDataType.SingleLineText
    );
  }

  private isWholeNumberField(schema: Schema, field: Field): boolean {
    return (
      this.resolveFieldDataType(schema, field) === EnumDataType.WholeNumber
    );
  }

  private isDecimalNumberField(schema: Schema, field: Field): boolean {
    return (
      this.resolveFieldDataType(schema, field) === EnumDataType.DecimalNumber
    );
  }

  private isBooleanField(schema: Schema, field: Field): boolean {
    return this.resolveFieldDataType(schema, field) === EnumDataType.Boolean;
  }

  private isDateTimeField(schema: Schema, field: Field): boolean {
    return this.resolveFieldDataType(schema, field) === EnumDataType.DateTime;
  }

  private isJsonField(schema: Schema, field: Field): boolean {
    return this.resolveFieldDataType(schema, field) === EnumDataType.Json;
  }

  private isIdField(schema: Schema, field: Field): boolean {
    return this.resolveFieldDataType(schema, field) === EnumDataType.Id;
  }

  private isLookupField(schema: Schema, field: Field): boolean {
    return this.resolveFieldDataType(schema, field) === EnumDataType.Lookup;
  }

  private isOptionSetField(schema: Schema, field: Field): boolean {
    return this.resolveFieldDataType(schema, field) === EnumDataType.OptionSet;
  }

  private isMultiSelectOptionSetField(schema: Schema, field: Field): boolean {
    return (
      this.resolveFieldDataType(schema, field) ===
      EnumDataType.MultiSelectOptionSet
    );
  }

  private isNotAnnotatedRelationField(schema: Schema, field: Field): boolean {
    const modelList = schema.list.filter((item) => item.type === "model");
    const relationAttribute = field.attributes?.find(
      (attr) => attr.name === "relation"
    );
    const fieldModelType = modelList.find(
      (modelItem: Model) =>
        formatModelName(modelItem.name).toLowerCase() ===
        pluralize.singular(formatFieldName(field.fieldType)).toLowerCase()
    );

    // check if the field is a relation field but not annotated with @relation, like order[] on Customer model
    if (!relationAttribute && fieldModelType) {
      return true;
    } else {
      return false;
    }
  }

  private isFkFieldOfARelation(schema: Schema, field: Field): boolean {
    const modelList = schema.list.filter((item) => item.type === "model");
    const fKFieldOfARelationOnModel = modelList.find((model: Model) => {
      const modelFields = model.properties.filter((property) => {
        property.type === "field";
      });
      const currentField = modelFields.find(
        (modelField: Field) =>
          formatFieldName(modelField.name).toLowerCase() ===
          formatFieldName(field.name).toLowerCase()
      ) as Field;

      if (!currentField) {
        this.logger.error(
          `Field ${field.name} not found in model ${model.name}`
        );
        throw new Error(`Field ${field.name} not found in model ${model.name}`);
      }

      const fkFieldOfARelation = modelFields.find((field: Field) => {
        field.attributes?.find((attr) => {
          const relationAttribute = attr.name === "relation";

          const relationField = attr.args.find(
            (attributeArgument: AttributeArgument) =>
              (attributeArgument.value as KeyValue).key === "fields"
          );

          const isRelationFieldIsOnRelationFieldArray = (
            relationField?.value as RelationArray
          ).args.find(
            (relationField: string) =>
              formatFieldName(relationField).toLowerCase() ===
              formatFieldName(field.name).toLowerCase()
          );

          if (
            relationAttribute &&
            relationField &&
            isRelationFieldIsOnRelationFieldArray
          ) {
            return field;
          }
        });
      });

      return fkFieldOfARelation;
    });
    return !!fKFieldOfARelationOnModel;
  }

  /********************
   * CONVERSION SECTION *
   ********************/
  convertPrismaBooleanToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateEntityInput[]
  ) {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateEntityInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityFields = this.prepareEntityFieldsByType(
      field,
      EnumDataType.Boolean
    );
    entityFields.properties = {};

    entity.fields.push(entityFields);

    return entity;
  }

  convertPrismaDateTimeToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateEntityInput[]
  ) {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateEntityInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityFields = this.prepareEntityFieldsByType(
      field,
      EnumDataType.DateTime
    );

    entityFields.properties = {
      timezone: "localTime",
      dateOnly: false,
    };

    entity.fields.push(entityFields);

    return entity;
  }

  convertPrismaDecimalNumberToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateEntityInput[]
  ) {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateEntityInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityFields = this.prepareEntityFieldsByType(
      field,
      EnumDataType.DecimalNumber
    );

    entityFields.properties = {
      minimumValue: 0,
      maximumValue: 99999999999,
      precision: 8,
    };

    entity.fields.push(entityFields);

    return entity;
  }

  convertPrismaWholeNumberToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateEntityInput[]
  ) {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateEntityInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityFields = this.prepareEntityFieldsByType(
      field,
      EnumDataType.WholeNumber
    );

    entityFields.properties = {
      minimumValue: 0,
      maximumValue: 99999999999,
    };

    entity.fields.push(entityFields);

    return entity;
  }

  convertPrismaSingleLineTextToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateEntityInput[]
  ) {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateEntityInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityFields = this.prepareEntityFieldsByType(
      field,
      EnumDataType.SingleLineText
    );

    entityFields.properties = {
      maxLength: 256,
    };

    entity.fields.push(entityFields);

    return entity;
  }

  convertPrismaJsonToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateEntityInput[]
  ) {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateEntityInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityFields = this.prepareEntityFieldsByType(
      field,
      EnumDataType.Json
    );

    entityFields.properties = {};

    entity.fields.push(entityFields);

    return entity;
  }

  convertPrismaIdToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateEntityInput[]
  ) {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateEntityInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityFields = this.prepareEntityFieldsByType(field, EnumDataType.Id);
    if (entityFields.customAttributes.includes("@default()")) {
      entityFields.customAttributes = entityFields.customAttributes.replace(
        "@default()",
        ""
      );
    }
    const defaultIdAttribute = field.attributes?.find(
      (attr) => attr.name === "default"
    );
    if (defaultIdAttribute && defaultIdAttribute.args) {
      entityFields.properties =
        idTypePropertyMap[(defaultIdAttribute.args[0].value as Func).name];
    } else {
      entityFields.properties = {};
    }

    entity.fields.push(entityFields);

    return entity;
  }

  convertPrismaOptionSetToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateEntityInput[]
  ) {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateEntityInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityFields = this.prepareEntityFieldsByType(
      field,
      EnumDataType.OptionSet
    );

    const enums = schema.list.filter((item) => item.type === "enum");
    const enumOfTheField = enums.find(
      (item: Enum) => item.name === field.name
    ) as Enum;

    if (!enumOfTheField) {
      this.logger.error(`Enum ${field.name} not found`);
      throw new Error(`Enum ${field.name} not found`);
    }

    const enumOptions = enumOfTheField.enumerators.map(
      (enumerator: Enumerator) => {
        return {
          label: enumerator.name,
          value: enumerator.name,
        };
      }
    );

    entityFields.properties = {
      options: enumOptions,
    };

    entity.fields.push(entityFields);

    return entity;
  }

  convertPrismaMultiSelectOptionSetToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateEntityInput[]
  ) {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateEntityInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityFields = this.prepareEntityFieldsByType(
      field,
      EnumDataType.MultiSelectOptionSet
    );

    const enums = schema.list.filter((item) => item.type === "enum");
    const enumOfTheField = enums.find(
      (item: Enum) => item.name === field.name
    ) as Enum;

    if (!enumOfTheField) {
      this.logger.error(`Enum ${field.name} not found`);
      throw new Error(`Enum ${field.name} not found`);
    }

    const enumOptions = enumOfTheField.enumerators.map(
      (enumerator: Enumerator) => {
        return {
          label: enumerator.name,
          value: enumerator.name,
        };
      }
    );

    entityFields.properties = {
      options: enumOptions,
    };

    entity.fields.push(entityFields);

    return entity;
  }

  // TODO: handle this: create the relation, the other side of the relation and the properties
  convertPrismaLookupToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateEntityInput[]
  ) {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateEntityInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityFields = this.prepareEntityFieldsByType(
      field,
      EnumDataType.Lookup
    );

    entityFields.properties = {
      relatedEntityId: null,
      relatedFieldId: null,
      allowMultipleSelection: false,
      fkHolder: null,
    };

    entity.fields.push(entityFields);

    return entity;
  }

  /**********************
   * OPERATIONS SECTION *
   **********************/

  /**
   * Add "@@map" attribute to model name if its name is plural or snake case
   * and rename model name to singular and in pascal case
   * @param builder prisma schema builder
   * @returns the new builder if there was a change or the old one if there was no change
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
          model.name = formatModelName(model.name);
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
        const isEnumFieldType =
          this.resolveFieldDataType(schema, field) === EnumDataType.OptionSet ||
          this.resolveFieldDataType(schema, field) ===
            EnumDataType.MultiSelectOptionSet;
        if (isInvalidFieldName && !isEnumFieldType) {
          builder
            .model(model.name)
            .field(field.name)
            .attribute("map", [field.name]);
          builder
            .model(model.name)
            .field(field.name)
            .then<Field>((field) => {
              field.name = formatFieldName(field.name);
            });
          return builder;
        }
      });
    });
    return builder;
  }

  /**
   * Search for the id of the table (decorated with @id) and if it is not named "id" rename it to "id" and add "@map" attribute
   * @param builder - prisma schema builder
   * @returns the new builder if there was a change or the old one if there was no change
   */
  private handleIdField(
    builder: ConcretePrismaSchemaBuilder
  ): ConcretePrismaSchemaBuilder {
    const schema = builder.getSchema();
    const models = schema.list.filter((item) => item.type === "model");

    models.map((model: Model) => {
      const modelFields = model.properties.filter(
        (property) => property.type === "field"
      ) as Field[];

      modelFields.map((field: Field) => {
        const idFieldIsNotNamedId =
          field.name !== "id" &&
          field.attributes?.some((attr) => attr.name === "id");

        const notIdFieldIsNamedId =
          field.name === "id" &&
          !field.attributes?.some((attr) => attr.name === "id");

        if (idFieldIsNotNamedId) {
          builder
            .model(model.name)
            .field(field.name)
            .attribute("map", [field.name]);
          builder
            .model(model.name)
            .field(field.name)
            .then<Field>((field) => {
              field.name = "id";
            });
          return builder;
        }

        if (notIdFieldIsNamedId) {
          builder
            .model(model.name)
            .field(field.name)
            .attribute("map", [field.name]);
          builder
            .model(model.name)
            .field(field.name)
            .then<Field>((field) => {
              field.name = `${model.name}Id`;
            });
          return builder;
        }
      });
    });
    return builder;
  }

  /**********************
   * VALIDATIONS SECTION *
   **********************/

  /**
   * Validate schema by Prisma
   * @param file the schema file that was uploaded
   * @throws if the schema is invalid
   * @returns void
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
   * Get the schema as a string after the upload and validate it against the schema validation rules for models and fields
   * @param schema schema string
   * @returns array of errors if there are any or null if there are no errors
   */
  validateSchemaProcessing(schema: string): ErrorMessage[] | null {
    const schemaObject = getSchema(schema);
    const errors: ErrorMessage[] = [];
    const models = schemaObject.list.filter((item) => item.type === "model");

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
