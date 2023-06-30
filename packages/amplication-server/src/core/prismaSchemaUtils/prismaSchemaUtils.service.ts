import { Inject, Injectable } from "@nestjs/common";
import { validate } from "@prisma/internals";
import {
  getSchema,
  Model,
  Field,
  createPrismaSchemaBuilder,
  Schema,
  Enum,
  KeyValue,
  RelationArray,
  Func,
  Enumerator,
  ConcretePrismaSchemaBuilder,
  Attribute,
  ModelAttribute,
  AttributeArgument,
} from "@mrleebo/prisma-ast";
import {
  booleanField,
  createAtField,
  dateTimeField,
  decimalNumberField,
  filterOutAmplicationAttributes,
  findFkFieldNameOnAnnotatedField,
  formatDisplayName,
  formatFieldName,
  formatModelName,
  handleModelNamesCollision,
  idField,
  idTypePropertyMap,
  idTypePropertyMapByFieldType,
  jsonField,
  lookupField,
  multiSelectOptionSetField,
  optionSetField,
  singleLineTextField,
  updateAtField,
  wholeNumberField,
} from "./schema-utils";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import pluralize from "pluralize";
import {
  ConvertPrismaSchemaForImportObjectsResponse,
  ExistingEntitySelect,
  Mapper,
  PrepareOperation,
  PrepareOperationIO,
  PrepareOperationInput,
} from "./types";
import { EnumDataType } from "../../enums/EnumDataType";
import cuid from "cuid";
import { types } from "@amplication/code-gen-types";
import { JsonValue } from "type-fest";
import {
  CreateBulkEntitiesInput,
  CreateBulkFieldsInput,
} from "../entity/entity.service";
import {
  ATTRIBUTE_TYPE_NAME,
  ENUM_TYPE_NAME,
  FIELD_TYPE_NAME,
  ID_ATTRIBUTE_NAME,
  ID_FIELD_NAME,
  MAP_ATTRIBUTE_NAME,
  MODEL_TYPE_NAME,
} from "./constants";
import { ActionLog, EnumActionLogLevel } from "../action/dto";

@Injectable()
export class PrismaSchemaUtilsService {
  private prepareOperations: PrepareOperation[] = [
    this.prepareModelNames,
    this.prepareFieldNames,
    this.prepareFieldTypes,
    this.prepareIdField,
  ];

  constructor(
    @Inject(AmplicationLogger) private readonly logger: AmplicationLogger
  ) {}

  /**
   * This function is the starting point for the schema processing after the schema is uploaded
   * First we make all the operations on the schema
   * Then we pass the prepared schema a function that converts the schema into entities and fields object
   * in a format that Amplication (entity service) can use to create the entities and fields
   * @param schema The schema to be processed
   * @returns The processed schema
   */
  convertPrismaSchemaForImportObjects(
    schema: string,
    existingEntities: ExistingEntitySelect[]
  ): ConvertPrismaSchemaForImportObjectsResponse {
    const log: ActionLog[] = [];

    log.push(
      new ActionLog({
        message: `Starting Prisma Schema Validation`,
        level: EnumActionLogLevel.Info,
      })
    );

    this.validateSchemaUpload(schema);

    const validationLog = this.validateSchemaProcessing(schema);
    const isErrorsValidationLog = validationLog.some(
      (log) => log.level === EnumActionLogLevel.Error
    );

    log.push(...validationLog);

    if (isErrorsValidationLog) {
      log.push(
        new ActionLog({
          message: `Prisma Schema Validation Failed`,
          level: EnumActionLogLevel.Error,
        })
      );

      return {
        preparedEntitiesWithFields: [],
        log,
      };
    } else {
      log.push(
        new ActionLog({
          message: `Prisma Schema Validation Completed`,
          level: EnumActionLogLevel.Info,
        })
      );
    }

    log.push(
      new ActionLog({
        message: `Prepare Prisma Schema for import`,
        level: EnumActionLogLevel.Info,
      })
    );

    const preparedSchemaResult = this.prepareSchema(...this.prepareOperations)({
      inputSchema: schema,
      existingEntities,
      log,
    });

    log.push(
      new ActionLog({
        message: `Prepare Prisma Schema for import completed`,
        level: EnumActionLogLevel.Info,
      })
    );

    log.push(
      new ActionLog({
        message: `Create import objects from Prisma Schema`,
        level: EnumActionLogLevel.Info,
      })
    );

    const preparedSchemaObject = preparedSchemaResult.builder.getSchema();
    const { importObjects, log: importObjectsLog } =
      this.convertPreparedSchemaForImportObjects(preparedSchemaObject);

    log.push(
      new ActionLog({
        message: `Create import objects from Prisma Schema completed`,
        level: EnumActionLogLevel.Info,
      })
    );
    return {
      preparedEntitiesWithFields: importObjects,
      log: [...log, ...importObjectsLog],
    };
  }

  /**
   * Prepare schema before passing it to entities and fields creation
   * @param operations functions with a declared interface: (prepareOperationIO: PrepareOperationIO) => PrepareOperationIO;
   * The functions are called one after the other and perform operations on the schema
   * The functions holds the state of the schema, the log and the mapper
   * The functions have a name pattern: prepare{OperationName}
   * @returns function that accepts the initial schema, the log and returns the prepared schema, the log and the mapper
   */
  private prepareSchema(
    ...operations: PrepareOperation[]
  ): ({
    inputSchema,
    existingEntities,
    log,
  }: PrepareOperationInput) => PrepareOperationIO {
    return ({
      inputSchema,
      existingEntities,
      log,
    }: PrepareOperationInput): PrepareOperationIO => {
      const builder = createPrismaSchemaBuilder(
        inputSchema
      ) as ConcretePrismaSchemaBuilder;
      const mapper: Mapper = {
        modelNames: {},
        fieldNames: {},
        fieldTypes: {},
        idFields: {},
      };

      operations.forEach((operation) => {
        operation.call(this, { builder, existingEntities, mapper, log });
      });

      return { builder, existingEntities, mapper, log };
    };
  }

  /**
   * This functions handles the models and the fields of the schema and converts them into entities and fields object.
   * First we create the entities by calling the "convertModelToEntity" function for each model.
   * Then we create the fields by determining the type of the field and calling the convertPrisma{filedType}ToEntityField function
   * @param schema
   * @returns entities and fields object in a format that Amplication (entity service) can use to create the entities and fields
   */
  private convertPreparedSchemaForImportObjects(schema: Schema): {
    importObjects: CreateBulkEntitiesInput[];
    log: ActionLog[];
  } {
    const log: ActionLog[] = [];
    const modelList = schema.list.filter(
      (item: Model) => item.type === MODEL_TYPE_NAME
    ) as Model[];

    const preparedEntities = modelList.map((model: Model) =>
      this.convertModelToEntity(model)
    );

    for (const model of modelList) {
      const modelFields = model.properties.filter(
        (property) => property.type === FIELD_TYPE_NAME
      ) as Field[];

      for (const field of modelFields) {
        if (this.isFkFieldOfARelation(schema, model, field)) {
          this.logger.info("FK field of a relation. Skip field creation", {
            fieldName: field.name,
            modelName: model.name,
          });
          continue;
        }

        if (this.isNotAnnotatedRelationField(schema, field)) {
          this.logger.info(
            "Not annotated relation field. Skip field creation",
            {
              fieldName: field.name,
              modelName: model.name,
            }
          );
          continue;
        }

        if (this.isIdField(schema, field)) {
          this.convertPrismaIdToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            log
          );
        } else if (this.isBooleanField(schema, field)) {
          this.convertPrismaBooleanToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            log
          );
        } else if (this.isCreatedAtField(schema, field)) {
          this.convertPrismaCreatedAtToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            log
          );
        } else if (this.isUpdatedAtField(schema, field)) {
          this.convertPrismaUpdatedAtToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            log
          );
        } else if (this.isDateTimeField(schema, field)) {
          this.convertPrismaDateTimeToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            log
          );
        } else if (this.isDecimalNumberField(schema, field)) {
          this.convertPrismaDecimalNumberToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            log
          );
        } else if (this.isWholeNumberField(schema, field)) {
          this.convertPrismaWholeNumberToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            log
          );
        } else if (this.isSingleLineTextField(schema, field)) {
          this.convertPrismaSingleLineTextToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            log
          );
        } else if (this.isJsonField(schema, field)) {
          this.convertPrismaJsonToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            log
          );
        } else if (this.isOptionSetField(schema, field)) {
          this.convertPrismaOptionSetToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            log
          );
        } else if (this.isMultiSelectOptionSetField(schema, field)) {
          this.convertPrismaMultiSelectOptionSetToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            log
          );
        } else if (this.isLookupField(schema, field)) {
          this.convertPrismaLookupToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            log
          );
        }
      }
    }

    return {
      importObjects: preparedEntities,
      log,
    };
  }

  /**********************
   * OPERATIONS SECTION *
   **********************/

  /**
   * Add "@@map" attribute to model name if its name is not in the correct format and rename model name to the correct format
   * @param builder prisma schema builder
   * @returns the new builder if there was a change or the old one if there was no change
   */
  private prepareModelNames({
    builder,
    existingEntities,
    mapper,
    log,
  }: PrepareOperationIO): PrepareOperationIO {
    const schema = builder.getSchema();
    const modelList = schema.list.filter(
      (item) => item.type === MODEL_TYPE_NAME
    ) as Model[];
    modelList.map((model: Model) => {
      const modelAttributes = model.properties.filter(
        (prop) => prop.type === ATTRIBUTE_TYPE_NAME
      ) as ModelAttribute[];

      const hasMapAttribute = modelAttributes?.some(
        (attribute) => attribute.name === MAP_ATTRIBUTE_NAME
      );

      const formattedModelName = formatModelName(model.name);

      if (formattedModelName !== model.name) {
        const newModelName = handleModelNamesCollision(
          modelList,
          existingEntities,
          mapper,
          formattedModelName
        );

        mapper.modelNames[model.name] = {
          oldName: model.name,
          newName: newModelName,
        };

        log.push(
          new ActionLog({
            message: `Model name "${model.name}" was changed to "${newModelName}"`,
            level: EnumActionLogLevel.Info,
          })
        );

        !hasMapAttribute &&
          builder
            .model(model.name)
            .blockAttribute(MAP_ATTRIBUTE_NAME, model.name);

        builder.model(model.name).then<Model>((model) => {
          model.name = newModelName;
        });
      }
    });
    return {
      builder,
      existingEntities,
      mapper,
      log,
    };
  }

  /**
   * Add "@map" attribute to field name if its name is in not in the correct format and it does NOT have "@id" attribute
   * because we handle id fields in a separated function.
   * Then, rename field name to the correct format
   * @param builder - prisma schema builder
   * @returns the new builder if there was a change or the old one if there was no change
   */
  private prepareFieldNames({
    builder,
    existingEntities,
    mapper,
    log,
  }: PrepareOperationIO): PrepareOperationIO {
    const schema = builder.getSchema();
    const models = schema.list.filter((item) => item.type === MODEL_TYPE_NAME);
    models.map((model: Model) => {
      const modelFieldList = model.properties.filter(
        (property) =>
          property.type === FIELD_TYPE_NAME &&
          !property.attributes?.some((attr) => attr.name === ID_ATTRIBUTE_NAME)
      ) as Field[];
      modelFieldList.map((field: Field) => {
        // we don't want to rename field if it is a foreign key holder
        if (this.isFkFieldOfARelation(schema, model, field)) return builder;
        if (this.isOptionSetField(schema, field)) return builder;
        if (this.isMultiSelectOptionSetField(schema, field)) return builder;

        const fieldAttributes = field.attributes?.filter(
          (attr) => attr.type === ATTRIBUTE_TYPE_NAME
        ) as Attribute[];

        const hasMapAttribute = fieldAttributes?.find(
          (attribute: Attribute) => attribute.name === MAP_ATTRIBUTE_NAME
        );

        const formattedFieldName = formatFieldName(field.name);

        if (formattedFieldName !== field.name) {
          const isFormattedFieldNameAlreadyTaken = modelFieldList.some(
            (fieldFromModelFieldList) =>
              fieldFromModelFieldList.name === formattedFieldName
          );

          const newFieldName = isFormattedFieldNameAlreadyTaken
            ? `${formattedFieldName}Field`
            : formattedFieldName;

          mapper.fieldNames[field.name] = {
            oldName: field.name,
            newName: newFieldName,
          };

          log.push(
            new ActionLog({
              message: `Field name "${field.name}" was changed to "${newFieldName}"`,
              level: EnumActionLogLevel.Info,
            })
          );

          !hasMapAttribute &&
            builder
              .model(model.name)
              .field(field.name)
              .attribute(MAP_ATTRIBUTE_NAME, [`"${field.name}"`]);

          builder
            .model(model.name)
            .field(field.name)
            .then<Field>((field) => {
              field.name = newFieldName;
            });
        }
      });
    });
    return {
      builder,
      existingEntities,
      mapper,
      log,
    };
  }

  /**
   * Format field types to the correct format (like the model name), but only if the type is not an enum type or scalar type
   * @param builder  prisma schema builder
   * @returns the new builder if there was a change or the old one if there was no change
   */
  private prepareFieldTypes({
    builder,
    existingEntities,
    mapper,
    log,
  }: PrepareOperationIO): PrepareOperationIO {
    const schema = builder.getSchema();
    const models = schema.list.filter((item) => item.type === MODEL_TYPE_NAME);

    Object.entries(mapper.modelNames).map(([oldName, { newName }]) => {
      models.map((model: Model) => {
        const fields = model.properties.filter(
          (property) => property.type === FIELD_TYPE_NAME
        ) as Field[];
        fields.map((field: Field) => {
          if (field.fieldType === oldName) {
            mapper.fieldTypes[field.fieldType] = {
              oldName: field.fieldType,
              newName,
            };

            log.push(
              new ActionLog({
                message: `field type "${field.fieldType}" on model "${model.name}" was changed to "${newName}"`,
                level: EnumActionLogLevel.Info,
              })
            );

            builder
              .model(model.name)
              .field(field.name)
              .then<Field>((field) => {
                field.fieldType = formatModelName(field.fieldType as string);
              });
          }
        });
      });
    });

    return {
      builder,
      existingEntities,
      mapper,
      log,
    };
  }

  /**
   * Search for the id of the table (decorated with @id) and if it is not named "id" rename it to "id" and add "@map" attribute
   * @param builder - prisma schema builder
   * @returns the new builder if there was a change or the old one if there was no change
   */
  private prepareIdField({
    builder,
    existingEntities,
    mapper,
    log,
  }: PrepareOperationIO): PrepareOperationIO {
    const schema = builder.getSchema();
    const models = schema.list.filter((item) => item.type === MODEL_TYPE_NAME);

    models.forEach((model: Model) => {
      const modelFields = model.properties.filter(
        (property) => property.type === FIELD_TYPE_NAME
      ) as Field[];

      modelFields.forEach((field: Field) => {
        const isIdField = field.attributes?.some(
          (attr) => attr.name === ID_ATTRIBUTE_NAME
        );
        if (!isIdField && field.name === ID_FIELD_NAME) {
          builder
            .model(model.name)
            .field(field.name)
            .attribute("map", [`"${model.name}Id"`]);
          builder
            .model(model.name)
            .field(field.name)
            .then<Field>((field) => {
              field.name = `${model.name}Id`;
            });

          mapper.idFields[field.name] = {
            oldName: field.name,
            newName: `${model.name}Id`,
          };

          log.push(
            new ActionLog({
              message: `field name "${field.name}" on model name ${model.name} was changed to "${model.name}Id"`,
              level: EnumActionLogLevel.Info,
            })
          );
        } else if (isIdField && field.name !== ID_FIELD_NAME) {
          builder
            .model(model.name)
            .field(field.name)
            .attribute("map", [`"${field.name}"`]);
          builder
            .model(model.name)
            .field(field.name)
            .then<Field>((field) => {
              field.name = ID_FIELD_NAME;
            });

          mapper.idFields[field.name] = {
            oldName: field.name,
            newName: `id`,
          };

          log.push(
            new ActionLog({
              message: `field name "${field.name}" on model name ${model.name} was changed to "id"`,
              level: EnumActionLogLevel.Info,
            })
          );
        }
      });
    });
    return {
      builder,
      existingEntities,
      mapper,
      log,
    };
  }

  /*****************************
   * PREPARE FUNCTIONS SECTION *
   *****************************/

  /**
   * Prepare an entity in a form of CreateBulkEntitiesInput
   * @param model the model to prepare
   * @returns entity in a structure of CreateBulkEntitiesInput
   */
  private convertModelToEntity(model: Model): CreateBulkEntitiesInput {
    const modelDisplayName = formatDisplayName(model.name);
    const modelAttributes = model.properties.filter(
      (prop) => prop.type === ATTRIBUTE_TYPE_NAME
    );
    const entityPluralDisplayName = pluralize(model.name);
    const entityAttributes = this.prepareAttributes(modelAttributes).join(" ");

    return {
      id: cuid(), // creating here the entity id because we need it for the relation
      name: model.name,
      displayName: modelDisplayName,
      pluralDisplayName: entityPluralDisplayName,
      description: "",
      customAttributes: entityAttributes,
      fields: [],
    };
  }

  /**
   * Prepare the fields of an entity in a form of CreateBulkFieldsInput
   * @param field the current field to prepare
   * @param fieldDataType the field data type
   * @returns the field in a structure of CreateBulkFieldsInput
   */
  private createOneEntityFieldCommonProperties(
    field: Field,
    fieldDataType: EnumDataType
  ): CreateBulkFieldsInput {
    const fieldDisplayName = formatDisplayName(field.name);
    const isUniqueField =
      field.attributes?.some((attr) => attr.name === "unique") ?? false;

    const fieldAttributes = filterOutAmplicationAttributes(
      this.prepareAttributes(field.attributes)
    )
      // in some case we get "@default()" as an attribute, we want to filter it out
      .filter((attr) => attr !== "@default()")
      .join(" ");

    return {
      name: field.name,
      displayName: fieldDisplayName,
      dataType: fieldDataType,
      required: !field.optional || false,
      unique: isUniqueField,
      searchable: false,
      description: "",
      properties: {},
      customAttributes: fieldAttributes,
    };
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
        return attribute.kind === MODEL_TYPE_NAME
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

      return `${attribute.kind === MODEL_TYPE_NAME ? "@@" : "@"}${
        attribute.name
      }(${args.join(", ")})`;
    });
  }

  /************************
   * FIELD DATA TYPE CHECKS *
   ************************/

  private isSingleLineTextField(schema: Schema, field: Field): boolean {
    return singleLineTextField(field) === EnumDataType.SingleLineText;
  }

  private isWholeNumberField(schema: Schema, field: Field): boolean {
    return wholeNumberField(field) === EnumDataType.WholeNumber;
  }

  private isDecimalNumberField(schema: Schema, field: Field): boolean {
    return decimalNumberField(field) === EnumDataType.DecimalNumber;
  }

  private isBooleanField(schema: Schema, field: Field): boolean {
    return booleanField(field) === EnumDataType.Boolean;
  }

  private isCreatedAtField(schema: Schema, field: Field): boolean {
    return createAtField(field) === EnumDataType.CreatedAt;
  }

  private isUpdatedAtField(schema: Schema, field: Field): boolean {
    return updateAtField(field) === EnumDataType.UpdatedAt;
  }

  private isDateTimeField(schema: Schema, field: Field): boolean {
    return dateTimeField(field) === EnumDataType.DateTime;
  }

  private isJsonField(schema: Schema, field: Field): boolean {
    return jsonField(field) === EnumDataType.Json;
  }

  private isIdField(schema: Schema, field: Field): boolean {
    return idField(field) === EnumDataType.Id;
  }

  private isLookupField(schema: Schema, field: Field): boolean {
    return lookupField(field) === EnumDataType.Lookup;
  }

  private isOptionSetField(schema: Schema, field: Field): boolean {
    return optionSetField(schema, field) === EnumDataType.OptionSet;
  }

  private isMultiSelectOptionSetField(schema: Schema, field: Field): boolean {
    return (
      multiSelectOptionSetField(schema, field) ===
      EnumDataType.MultiSelectOptionSet
    );
  }

  private isNotAnnotatedRelationField(schema: Schema, field: Field): boolean {
    const modelList = schema.list.filter(
      (item) => item.type === MODEL_TYPE_NAME
    );
    const relationAttribute = field.attributes?.some(
      (attr) => attr.name === "relation"
    );

    const hasRelationAttributeWithRelationName =
      field.attributes?.some(
        (attr) =>
          attr.name === "relation" &&
          attr.args?.some((arg) => typeof arg.value === "string")
      ) ?? false;

    const fieldModelType = modelList.find(
      (modelItem: Model) =>
        formatModelName(modelItem.name) === formatFieldName(field.fieldType)
    );

    // check if the field is a relation field but it doesn't have the @relation attribute, like order[] on Customer model,
    // or it has the @relation attribute but without reference field
    if (
      (!relationAttribute && fieldModelType) ||
      (fieldModelType && hasRelationAttributeWithRelationName)
    ) {
      return true;
    } else {
      return false;
    }
  }

  private isFkFieldOfARelation(
    schema: Schema,
    model: Model,
    field: Field
  ): boolean {
    const modelFields = model.properties.filter(
      (property) => property.type === FIELD_TYPE_NAME
    ) as Field[];

    const relationFiledWithReference = modelFields.filter((modelField: Field) =>
      modelField.attributes?.some(
        (attr) =>
          attr.name === "relation" &&
          attr.args?.some(
            (arg) =>
              (arg.value as KeyValue).key === "fields" &&
              ((arg.value as KeyValue).value as RelationArray).args.find(
                (argName) => argName === field.name
              )
          )
      )
    );

    if (relationFiledWithReference.length > 1) {
      this.logger.error(
        `Field ${field.name} on model ${model.name} has more than one relation field`
      );
      this.logger.error(
        `Field ${field.name} on model ${model.name} has more than one relation field`
      );
    }

    return !!(relationFiledWithReference.length === 1);
  }

  /********************
   * CONVERSION SECTION *
   ********************/
  private convertPrismaBooleanToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateBulkEntitiesInput[],
    log: ActionLog[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      log.push(
        new ActionLog({
          message: `Entity ${model.name} not found`,
          level: EnumActionLogLevel.Error,
        })
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.Boolean
    );

    entity.fields.push(entityField);

    return entity;
  }

  private convertPrismaCreatedAtToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateBulkEntitiesInput[],
    log: ActionLog[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      log.push(
        new ActionLog({
          message: `Entity ${model.name} not found`,
          level: EnumActionLogLevel.Error,
        })
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.CreatedAt
    );

    entity.fields.push(entityField);

    return entity;
  }

  private convertPrismaUpdatedAtToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateBulkEntitiesInput[],
    log: ActionLog[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      log.push(
        new ActionLog({
          message: `Entity ${model.name} not found`,
          level: EnumActionLogLevel.Error,
        })
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.UpdatedAt
    );

    entity.fields.push(entityField);

    return entity;
  }

  private convertPrismaDateTimeToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateBulkEntitiesInput[],
    log: ActionLog[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      log.push(
        new ActionLog({
          message: `Entity ${model.name} not found`,
          level: EnumActionLogLevel.Error,
        })
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.DateTime
    );

    const properties = <types.DateTime>{
      timeZone: "localTime",
      dateOnly: false,
    };

    entityField.properties = properties as unknown as {
      [key: string]: JsonValue;
    };

    entity.fields.push(entityField);

    return entity;
  }

  private convertPrismaDecimalNumberToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateBulkEntitiesInput[],
    log: ActionLog[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      log.push(
        new ActionLog({
          message: `Entity ${model.name} not found`,
          level: EnumActionLogLevel.Error,
        })
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.DecimalNumber
    );

    const properties = <types.DecimalNumber>{
      minimumValue: 0,
      maximumValue: 99999999999,
      precision: 8,
    };

    entityField.properties = properties as unknown as {
      [key: string]: JsonValue;
    };

    entity.fields.push(entityField);

    return entity;
  }

  private convertPrismaWholeNumberToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateBulkEntitiesInput[],
    log: ActionLog[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      log.push(
        new ActionLog({
          message: `Entity ${model.name} not found`,
          level: EnumActionLogLevel.Error,
        })
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.WholeNumber
    );

    const properties = <types.WholeNumber>{
      minimumValue: 0,
      maximumValue: 99999999999,
    };

    entityField.properties = properties as unknown as {
      [key: string]: JsonValue;
    };

    entity.fields.push(entityField);

    return entity;
  }

  private convertPrismaSingleLineTextToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateBulkEntitiesInput[],
    log: ActionLog[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      log.push(
        new ActionLog({
          message: `Entity ${model.name} not found`,
          level: EnumActionLogLevel.Error,
        })
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.SingleLineText
    );

    const properties: types.SingleLineText = <types.SingleLineText>{
      maxLength: 256,
    };

    entityField.properties = properties as unknown as {
      [key: string]: JsonValue;
    };

    entity.fields.push(entityField);

    return entity;
  }

  private convertPrismaJsonToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateBulkEntitiesInput[],
    log: ActionLog[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      log.push(
        new ActionLog({
          message: `Entity ${model.name} not found`,
          level: EnumActionLogLevel.Error,
        })
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.Json
    );

    entity.fields.push(entityField);

    return entity;
  }

  private convertPrismaIdToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateBulkEntitiesInput[],
    log: ActionLog[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      log.push(
        new ActionLog({
          message: `Entity ${model.name} not found`,
          level: EnumActionLogLevel.Error,
        })
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.Id
    );

    const defaultIdAttribute = field.attributes?.find(
      (attr) => attr.name === "default"
    );

    if (!defaultIdAttribute) {
      const properties = <types.Id>{
        idType: idTypePropertyMapByFieldType[field.fieldType as string],
      };
      entityField.properties = properties as unknown as {
        [key: string]: JsonValue;
      };
    }

    if (defaultIdAttribute && defaultIdAttribute.args) {
      const idType = (defaultIdAttribute.args[0].value as Func).name || "cuid";
      const properties = <types.Id>{
        idType: idTypePropertyMap[idType],
      };
      entityField.properties = properties as unknown as {
        [key: string]: JsonValue;
      };
    }

    entity.fields.push(entityField);

    return entity;
  }

  private convertPrismaOptionSetToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateBulkEntitiesInput[],
    log: ActionLog[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      log.push(
        new ActionLog({
          message: `Entity ${model.name} not found`,
          level: EnumActionLogLevel.Error,
        })
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.OptionSet
    );

    const enums = schema.list.filter((item) => item.type === ENUM_TYPE_NAME);
    const enumOfTheField = enums.find(
      (item: Enum) =>
        formatModelName(item.name) ===
        formatModelName(field.fieldType as string)
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

    const properties = <types.OptionSet>{
      options: enumOptions,
    };

    entityField.properties = properties as unknown as {
      [key: string]: JsonValue;
    };

    entity.fields.push(entityField);

    return entity;
  }

  private convertPrismaMultiSelectOptionSetToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateBulkEntitiesInput[],
    log: ActionLog[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      log.push(
        new ActionLog({
          message: `Entity ${model.name} not found`,
          level: EnumActionLogLevel.Error,
        })
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.MultiSelectOptionSet
    );

    const enums = schema.list.filter((item) => item.type === ENUM_TYPE_NAME);
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

    const properties = <types.MultiSelectOptionSet>{
      options: enumOptions,
    };

    entityField.properties = properties as unknown as {
      [key: string]: JsonValue;
    };

    entity.fields.push(entityField);

    return entity;
  }

  private convertPrismaLookupToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateBulkEntitiesInput[],
    log: ActionLog[]
  ): CreateBulkEntitiesInput {
    try {
      const entity = preparedEntities.find(
        (entity) => entity.name === model.name
      ) as CreateBulkEntitiesInput;

      if (!entity) {
        this.logger.error(`Entity ${model.name} not found`);
        log.push(
          new ActionLog({
            message: `Entity ${model.name} not found`,
            level: EnumActionLogLevel.Error,
          })
        );
        throw new Error(`Entity ${model.name} not found`);
      }
      // create the relation filed on the main side of the relation
      const entityField = this.createOneEntityFieldCommonProperties(
        field,
        EnumDataType.Lookup
      );

      const remoteModelAndField = this.findRemoteRelatedModelAndField(
        schema,
        model,
        field
      );

      if (!remoteModelAndField) {
        this.logger.error(
          `Remote model and field not found for ${model.name}.${field.name}`
        );
        throw new Error(
          `Remote model and field not found for ${model.name}.${field.name}`
        );
      }

      const { remoteModel, remoteField } = remoteModelAndField;

      const relatedField = this.createOneEntityFieldCommonProperties(
        remoteField,
        EnumDataType.Lookup
      );

      entityField.relatedFieldName = relatedField.name;
      entityField.relatedFieldDisplayName = relatedField.displayName;
      entityField.relatedFieldAllowMultipleSelection =
        remoteField.array || false;

      const relatedEntity = preparedEntities.find(
        (entity) => entity.name === remoteModel.name
      ) as CreateBulkEntitiesInput;

      const fkFieldName = findFkFieldNameOnAnnotatedField(field);

      const properties = <types.Lookup>{
        relatedEntityId: relatedEntity.id,
        allowMultipleSelection: field.array || false,
        fkHolder: null,
        fkFieldName: fkFieldName,
      };

      entityField.properties = properties as unknown as {
        [key: string]: JsonValue;
      };

      entity.fields.push(entityField);

      return entity;
    } catch (error) {
      this.logger.error(error.message, error, {
        functionName: "convertPrismaLookupToEntityField",
      });
      log.push(
        new ActionLog({
          message: error.message,
          level: EnumActionLogLevel.Error,
        })
      );
      throw error;
    }
  }

  /******************
   * HELPERS SECTION *
   ******************/

  /**
   * Find the related field in the remote model and return it
   * @param schema the whole processed schema
   * @param model the current model we are working on
   * @param field the current field we are working on
   */
  private findRemoteRelatedModelAndField(
    schema: Schema,
    model: Model,
    field: Field
  ): { remoteModel: Model; remoteField: Field } | undefined {
    let relationAttributeName: string | undefined;
    let remoteField: Field | undefined;
    let relationAttributeStringArgument: AttributeArgument | undefined;

    // in the main relation, check if the relation annotation has a name
    field.attributes?.find((attr) => {
      const relationAttribute = attr.name === "relation";

      if (relationAttribute) {
        relationAttributeStringArgument = attr.args?.find(
          (arg) => typeof arg.value === "string"
        );
      }

      relationAttributeName =
        relationAttributeStringArgument &&
        (relationAttributeStringArgument.value as string);
    });

    const remoteModel = schema.list.find(
      (item) =>
        item.type === MODEL_TYPE_NAME &&
        formatModelName(item.name) ===
          formatModelName(field.fieldType as string)
    ) as Model;

    if (!remoteModel) {
      this.logger.error(
        `Model ${field.fieldType} not found in the schema. Please check your schema.prisma file`
      );
      throw new Error(
        `Model ${field.fieldType} not found in the schema. Please check your schema.prisma file`
      );
    }

    const remoteModelFields = remoteModel.properties.filter(
      (property) => property.type === FIELD_TYPE_NAME
    ) as Field[];

    if (relationAttributeName) {
      // find the remote field in the remote model that has the relation attribute with the name we found
      remoteField = remoteModelFields.find((field: Field) => {
        return field.attributes?.some(
          (attr) =>
            attr.name === "relation" &&
            attr.args?.find((arg) => arg.value === relationAttributeName)
        );
      });
    } else {
      const remoteFields = remoteModelFields.filter((remoteField: Field) => {
        const hasRelationAttribute = remoteField.attributes?.some(
          (attr) => attr.name === "relation"
        );

        return (
          formatModelName(remoteField.fieldType as string) ===
            formatModelName(model.name) && !hasRelationAttribute
        );
      });

      if (remoteFields.length > 1) {
        throw new Error(
          `Multiple fields found in model ${remoteModel.name} that reference ${model.name}`
        );
      }

      if (remoteFields.length === 1) {
        remoteField = remoteFields[0];
      }
    }

    if (!remoteField) {
      throw new Error(
        `No field found in model ${remoteModel.name} that reference ${model.name}`
      );
    }

    return { remoteModel, remoteField };
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
  private validateSchemaUpload(file: string): void {
    const schemaString = file.replace(/\\n/g, "\n");
    try {
      validate({ datamodel: schemaString });
      this.logger.info("Valid schema");
    } catch (error) {
      this.logger.error("Invalid schema", error);
      throw error;
    }
  }

  /**
   * Get the schema as a string after the upload and validate it against the schema validation rules for models and fields
   * @param schema schema string
   * @returns array of errors if there are any or null if there are no errors
   */
  private validateSchemaProcessing(schema: string): ActionLog[] {
    const schemaObject = getSchema(schema);
    const errors: ActionLog[] = [];
    const models = schemaObject.list.filter(
      (item) => item.type === MODEL_TYPE_NAME
    ) as Model[];

    if (models.length === 0) {
      errors.push(
        new ActionLog({
          message: "A schema must contain at least one model",
          level: EnumActionLogLevel.Error,
        })
      );
    }

    return errors.length > 0 ? errors : [];
  }
}
