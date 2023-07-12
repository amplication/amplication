import { Inject, Injectable } from "@nestjs/common";
import cuid from "cuid";
import { types } from "@amplication/code-gen-types";
import { JsonValue } from "type-fest";
import {
  Model,
  Field,
  createPrismaSchemaBuilder,
  Schema,
  Enum,
  KeyValue,
  RelationArray,
  Func,
  ConcretePrismaSchemaBuilder,
  Attribute,
  BlockAttribute,
} from "@mrleebo/prisma-ast";
import {
  booleanField,
  createAtField,
  dateTimeField,
  decimalNumberField,
  formatDisplayName,
  formatFieldName,
  formatModelName,
  idField,
  jsonField,
  lookupField,
  multiSelectOptionSetField,
  optionSetField,
  singleLineTextField,
  updateAtField,
  wholeNumberField,
} from "./helpers";
import {
  handleModelNamesCollision,
  findFkFieldNameOnAnnotatedField,
  prepareModelAttributes,
  createOneEntityFieldCommonProperties,
  findRemoteRelatedModelAndField,
  handleEnumMapAttribute,
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
import {
  ARG_KEY_FIELD_NAME,
  ATTRIBUTE_TYPE_NAME,
  ENUM_TYPE_NAME,
  FIELD_TYPE_NAME,
  ID_ATTRIBUTE_NAME,
  ID_FIELD_NAME,
  MAP_ATTRIBUTE_NAME,
  MODEL_TYPE_NAME,
  OBJECT_KIND_NAME,
  RELATION_ATTRIBUTE_NAME,
  UNIQUE_ATTRIBUTE_NAME,
  idTypePropertyMap,
  idTypePropertyMapByFieldType,
} from "./constants";
import { validateSchemaProcessing, validateSchemaUpload } from "./validators";
import { EnumDataType } from "../../enums/EnumDataType";
import { CreateBulkEntitiesInput } from "../entity/entity.service";
import { ActionLog, EnumActionLogLevel } from "../action/dto";

@Injectable()
export class PrismaSchemaParserService {
  private prepareOperations: PrepareOperation[] = [
    this.prepareModelNames,
    this.prepareFieldNames,
    this.prepareFieldTypes,
    this.prepareModelIdAttribute,
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
  async convertPrismaSchemaForImportObjects(
    schema: string,
    existingEntities: ExistingEntitySelect[]
  ): Promise<ConvertPrismaSchemaForImportObjectsResponse> {
    const log: ActionLog[] = [];

    log.push(
      new ActionLog({
        message: `Starting Prisma Schema Validation`,
        level: EnumActionLogLevel.Info,
      })
    );

    validateSchemaUpload(schema);

    const validationLog = validateSchemaProcessing(schema);
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
   * Acts as a pipeline that executes a series of transformations on the Prisma schema to prepare it for further use in Amplication (entities and fields creation).
   * @param operations functions with a declared interface: (prepareOperationIO: PrepareOperationIO) => PrepareOperationIO;
   * @param inputSchema The Prisma schema to be processed
   * @param existingEntities The existing entities in the service
   * @param log The log of the process
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
          this.logger.debug("FK field of a relation. Skip field creation", {
            fieldName: field.name,
            modelName: model.name,
          });
          continue;
        }

        if (this.isNotAnnotatedRelationField(schema, field)) {
          this.logger.debug(
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

  /*****************************
   * PREPARE OPERATIONS SECTION *
   *****************************/

  /**
   * Renames models in the Prisma schema to follow a certain format
   * handles potential name collisions, and keeps track of the changes in the mapper.
   * Ensures that original model names are preserved in the database by adding `@@map` attributes where needed.
   * If the model already has the **`@@map`** attribute, it won’t be added, even if the model name was formatted.
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
        (prop) =>
          prop.type === ATTRIBUTE_TYPE_NAME && prop.kind === OBJECT_KIND_NAME
      ) as BlockAttribute[];

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
   * Renames fields in the models of the Prisma schema to follow a certain format.
   * Handles potential name collisions and keeps track of the changes in the mapper.
   * Ensures that original field names are preserved in the database by adding **`@map`** attributes where needed.
   * If the field already has the `@map` attribute, it won’t be added, even if the field name was formatted.
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
   * Updates the types of fields in the Prisma schema based on changes made to the model names (with the help of the mapper).
   * Logs these changes and keeps track of them in the mapper
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
                field.fieldType = newName;
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
   * This function handle cases where the model doesn't have an id field (field with "@id" attribute),
   * but it has a composite id - unique identifier for a record in a database that is formed by combining multiple field values.
   * Model with composite id are decorated with `@@id` attribute on the model.
   * In this cases, we rename the `@@id` attribute to `@@unique` and add id filed of type String with `@id` attribute to the model
   */
  private prepareModelIdAttribute({
    builder,
    existingEntities,
    mapper,
    log,
  }: PrepareOperationIO): PrepareOperationIO {
    const schema = builder.getSchema();
    const models = schema.list.filter((item) => item.type === MODEL_TYPE_NAME);

    models.forEach((model: Model) => {
      const modelAttributes = model.properties.filter(
        (prop) =>
          prop.type === ATTRIBUTE_TYPE_NAME && prop.kind === OBJECT_KIND_NAME
      ) as BlockAttribute[];

      const modelIdAttribute = modelAttributes.find(
        (attribute) => attribute.name === ID_ATTRIBUTE_NAME
      );

      if (!modelIdAttribute) return builder;

      // rename the @@id attribute to @@unique
      builder.model(model.name).then<Model>((model) => {
        modelIdAttribute.name = UNIQUE_ATTRIBUTE_NAME;
      });

      log.push(
        new ActionLog({
          message: `Attribute "${ID_ATTRIBUTE_NAME}" was changed to "${UNIQUE_ATTRIBUTE_NAME}" on model "${model.name}"`,
          level: EnumActionLogLevel.Warning,
        })
      );

      // add an id field with id attribute to the model
      builder
        .model(model.name)
        .field(ID_FIELD_NAME, "String")
        .attribute(ID_ATTRIBUTE_NAME);

      log.push(
        new ActionLog({
          message: `id field was added to model "${model.name}"`,
          level: EnumActionLogLevel.Warning,
        })
      );
    });

    return {
      builder,
      existingEntities,
      mapper,
      log,
    };
  }

  /**
   * Ensures the correct formatting and naming of ID fields in all models of the Prisma schema:
   * If a non-ID field is named id, it's renamed to ${modelName}Id to prevent any collisions with the actual ID field.
   * If an ID field (a field with an `@id` attribute) has a different name, it's renamed to id
   * In both cases, a `@map` attribute is added to the field with the original field name
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
    const relationAttribute =
      field.attributes?.some((attr) => attr.name === RELATION_ATTRIBUTE_NAME) ??
      false;

    const hasRelationAttributeWithRelationNameAndWithoutReferenceField =
      field.attributes?.some(
        (attr) =>
          attr.name === RELATION_ATTRIBUTE_NAME &&
          attr.args?.some((arg) => typeof arg.value === "string") &&
          !attr.args?.find(
            (arg) => (arg.value as KeyValue).key === ARG_KEY_FIELD_NAME
          )
      ) ?? false;

    const fieldModelType = modelList.find(
      (modelItem: Model) => modelItem.name === field.fieldType
    );

    // check if the field is a relation field but it doesn't have the @relation attribute, like order[] on Customer model,
    // or it has the @relation attribute but without reference field
    return (
      (fieldModelType && !relationAttribute) ||
      (fieldModelType &&
        hasRelationAttributeWithRelationNameAndWithoutReferenceField)
    );
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

  /**
   * convert a model in the Prisma schema to an entity used within Amplication
   * @param model the model to prepare
   * @returns entity in a structure of CreateBulkEntitiesInput
   */
  private convertModelToEntity(model: Model): CreateBulkEntitiesInput {
    const modelDisplayName = formatDisplayName(model.name);
    const modelAttributes = model.properties.filter(
      (prop) =>
        prop.type === ATTRIBUTE_TYPE_NAME && prop.kind === OBJECT_KIND_NAME
    ) as BlockAttribute[];
    const entityPluralDisplayName = pluralize(model.name);
    const entityAttributes = prepareModelAttributes(modelAttributes).join(" ");

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

    const entityField = createOneEntityFieldCommonProperties(
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

    const entityField = createOneEntityFieldCommonProperties(
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

    const entityField = createOneEntityFieldCommonProperties(
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

    const entityField = createOneEntityFieldCommonProperties(
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

    const entityField = createOneEntityFieldCommonProperties(
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

    const entityField = createOneEntityFieldCommonProperties(
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

    const entityField = createOneEntityFieldCommonProperties(
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

    const entityField = createOneEntityFieldCommonProperties(
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

    const entityField = createOneEntityFieldCommonProperties(
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

    const entityField = createOneEntityFieldCommonProperties(
      field,
      EnumDataType.OptionSet
    );

    const enums = schema.list.filter((item) => item.type === ENUM_TYPE_NAME);
    const enumOfTheField = enums.find(
      (item: Enum) => item.name === field.fieldType
    ) as Enum;

    if (!enumOfTheField) {
      this.logger.error(`Enum ${field.name} not found`);
      throw new Error(`Enum ${field.name} not found`);
    }

    const enumOptions = handleEnumMapAttribute(enumOfTheField, log);

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

    const entityField = createOneEntityFieldCommonProperties(
      field,
      EnumDataType.MultiSelectOptionSet
    );

    const enums = schema.list.filter((item) => item.type === ENUM_TYPE_NAME);
    const enumOfTheField = enums.find(
      (item: Enum) => item.name === field.fieldType
    ) as Enum;

    if (!enumOfTheField) {
      this.logger.error(`Enum ${field.name} not found`);
      throw new Error(`Enum ${field.name} not found`);
    }

    const enumOptions = handleEnumMapAttribute(enumOfTheField, log);

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
      const entityField = createOneEntityFieldCommonProperties(
        field,
        EnumDataType.Lookup
      );

      const remoteModelAndField = findRemoteRelatedModelAndField(
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

      const relatedField = createOneEntityFieldCommonProperties(
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
}
