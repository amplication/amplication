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
  findOriginalFieldName,
  findOriginalModelName,
  isValidIdFieldType,
  isUniqueField,
} from "./helpers";
import {
  handleModelNamesCollision,
  findFkFieldNameOnAnnotatedField,
  prepareModelAttributes,
  createOneEntityFieldCommonProperties,
  findRemoteRelatedModelAndField,
  handleEnumMapAttribute,
  convertUniqueFieldNotNamedIdToIdField,
  convertUniqueFieldNamedIdToIdField,
  addIdFieldIfNotExists,
  handleIdFieldNotNamedId,
  addMapAttributeToField,
  addMapAttributeToModel,
  findRelationAttributeName,
  handleNotIdFieldNameId,
  convertModelIdToFieldId,
  getDatasourceProviderFromSchema,
} from "./schema-utils";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import pluralize from "pluralize";
import {
  ExistingEntitiesWithFieldsMap,
  Mapper,
  PrepareOperation,
  PrepareOperationIO,
  PrepareOperationInput,
} from "./types";
import {
  ARG_KEY_FIELD_NAME,
  ARRAY_ARG_TYPE_NAME,
  ATTRIBUTE_TYPE_NAME,
  DEFAULT_ATTRIBUTE_NAME,
  ENUM_TYPE_NAME,
  FIELD_TYPE_NAME,
  FUNCTION_ARG_TYPE_NAME,
  ID_ATTRIBUTE_NAME,
  ID_DEFAULT_VALUE_AUTO_INCREMENT,
  ID_DEFAULT_VALUE_CUID,
  ID_DEFAULT_VALUE_UUID,
  ID_FIELD_NAME,
  ID_TYPE_AUTO_INCREMENT,
  ID_TYPE_AUTO_INCREMENT_BIG_INT,
  ID_TYPE_CUID,
  ID_TYPE_UUID,
  INDEX_ATTRIBUTE_NAME,
  MODEL_TYPE_NAME,
  OBJECT_KIND_NAME,
  PRISMA_TYPE_BIG_INT,
  PRISMA_TYPE_INT,
  PRISMA_TYPE_STRING,
  RELATION_ATTRIBUTE_NAME,
  UNIQUE_ATTRIBUTE_NAME,
  WholeNumberType,
  DecimalNumberType,
  idTypePropertyMapByPrismaFieldType,
  MAP_ATTRIBUTE_NAME,
  ID_DEFAULT_VALUE_CUID_FUNCTION,
  ID_DEFAULT_VALUE_UUID_FUNCTION,
  ID_DEFAULT_VALUE_AUTO_INCREMENT_FUNCTION,
  prismaIdTypeToDefaultIdType,
} from "./constants";
import { isValidSchema } from "./validators";
import { EnumDataType } from "../../enums/EnumDataType";
import { CreateBulkEntitiesInput } from "../entity/entity.service";
import { EnumActionLogLevel } from "../action/dto";
import { ActionContext } from "../userAction/types";

@Injectable()
export class PrismaSchemaParserService {
  private datasourceProvider: string;
  private prepareOperations: PrepareOperation[] = [
    this.prepareModelNames,
    this.prepareFieldNames,
    this.prepareFieldTypes,
    this.prepareModelIdAttribute,
    this.prepareIdField,
    this.prepareModelCompositeTypeAttributes,
    this.prepareRelationReferenceFields,
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
    existingEntities: ExistingEntitiesWithFieldsMap,
    actionContext: ActionContext
  ): Promise<CreateBulkEntitiesInput[]> {
    const { onEmitUserActionLog } = actionContext;

    // enforce the order of the logs
    await onEmitUserActionLog(
      "Starting Prisma Schema Validation",
      EnumActionLogLevel.Info
    );

    const schemaValidation = isValidSchema(schema);

    if (!schemaValidation.isValid) {
      // the error will be caught, logged and completed by the caller (entity service)
      throw new Error(schemaValidation.errorMessage);
    } else {
      void onEmitUserActionLog(
        "Prisma Schema Validation completed successfully",
        EnumActionLogLevel.Info
      );

      this.datasourceProvider = getDatasourceProviderFromSchema(schema);
      this.logger.debug(`Datasource provider: ${this.datasourceProvider}`);

      void onEmitUserActionLog(
        "Prepare Prisma Schema for import",
        EnumActionLogLevel.Info
      );

      const preparedSchemaResult = this.prepareSchema(
        ...this.prepareOperations
      )({
        inputSchema: schema,
        existingEntities,
        actionContext,
      });

      void onEmitUserActionLog(
        "Prepare Prisma Schema for import completed",
        EnumActionLogLevel.Info
      );

      void onEmitUserActionLog(
        "Create import objects from Prisma Schema",
        EnumActionLogLevel.Info
      );

      const preparedSchemaObject = preparedSchemaResult.builder.getSchema();
      const importObjects = this.convertPreparedSchemaForImportObjects(
        preparedSchemaObject,
        actionContext,
        existingEntities
      );

      void onEmitUserActionLog(
        "Create import objects from Prisma Schema completed",
        EnumActionLogLevel.Info
      );
      return importObjects;
    }
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
    actionContext,
  }: PrepareOperationInput) => PrepareOperationIO {
    return ({
      inputSchema,
      existingEntities,
      actionContext,
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
        operation.call(this, {
          builder,
          existingEntities,
          mapper,
          actionContext,
        });
      });

      return { builder, existingEntities, mapper, actionContext };
    };
  }

  /**
   * This functions handles the models and the fields of the schema and converts them into entities and fields object.
   * First we create the entities by calling the "convertModelToEntity" function for each model.
   * Then we create the fields by determining the type of the field and calling the convertPrisma{filedType}ToEntityField function
   * @param schema
   * @returns entities and fields object in a format that Amplication (entity service) can use to create the entities and fields
   */
  private convertPreparedSchemaForImportObjects(
    schema: Schema,
    actionContext: ActionContext,
    existingEntities: ExistingEntitiesWithFieldsMap
  ): CreateBulkEntitiesInput[] {
    const modelList = schema.list.filter(
      (item: Model) => item.type === MODEL_TYPE_NAME
    ) as Model[];

    const preparedEntities = modelList.map((model: Model) =>
      this.convertModelToEntity(model, existingEntities)
    );

    for (const model of modelList) {
      const modelFields = model.properties.filter(
        (property) => property.type === FIELD_TYPE_NAME
      ) as Field[];

      for (const field of modelFields) {
        const isManyToMany = this.isManyToManyRelation(schema, model, field);

        if (this.isFkFieldOfARelation(schema, model, field)) {
          continue;
        }

        /** we want to skip fields that are not annotated - meaning they don't have a relation attribute 
         OR that they only have a name relation attribute: @relation(name: "someName") / @relation("someName")
         we also skip many to many relation because these fields are handled in the convertPrismaManyToManyToEntityField function
         look at isLookupField function for more details) */
        if (this.isNotAnnotatedRelationField(schema, field) && !isManyToMany) {
          continue;
        }

        if (this.isIdField(schema, field)) {
          this.convertPrismaIdToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            actionContext,
            existingEntities
          );
        } else if (this.isBooleanField(schema, field)) {
          this.convertPrismaBooleanToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            actionContext,
            existingEntities
          );
        } else if (this.isCreatedAtField(schema, field)) {
          this.convertPrismaCreatedAtToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            actionContext,
            existingEntities
          );
        } else if (this.isUpdatedAtField(schema, field)) {
          this.convertPrismaUpdatedAtToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            actionContext,
            existingEntities
          );
        } else if (this.isDateTimeField(schema, field)) {
          this.convertPrismaDateTimeToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            actionContext,
            existingEntities
          );
        } else if (this.isDecimalNumberField(schema, field)) {
          this.convertPrismaDecimalNumberToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            actionContext,
            existingEntities
          );
        } else if (this.isWholeNumberField(schema, field)) {
          this.convertPrismaWholeNumberToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            actionContext,
            existingEntities
          );
        } else if (this.isSingleLineTextField(schema, field)) {
          this.convertPrismaSingleLineTextToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            actionContext,
            existingEntities
          );
        } else if (this.isJsonField(schema, field)) {
          this.convertPrismaJsonToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            actionContext,
            existingEntities
          );
        } else if (this.isOptionSetField(schema, field)) {
          this.convertPrismaOptionSetToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            actionContext,
            existingEntities
          );
        } else if (this.isMultiSelectOptionSetField(schema, field)) {
          this.convertPrismaMultiSelectOptionSetToEntityField(
            schema,
            model,
            field,
            preparedEntities,
            actionContext,
            existingEntities
          );
        } else if (this.isLookupField(schema, field)) {
          if (isManyToMany) {
            const isOneOfTheSidesExists = preparedEntities.some((entity) => {
              return entity.fields.find((entityField) => {
                return (
                  entityField.dataType === EnumDataType.Lookup &&
                  entityField.relatedFieldName === field.name
                );
              });
            });

            // only if we haven't already created any sides of the relation
            // this check is needed because in the entity service we create the related entity of the entity that we are currently creating
            if (!isOneOfTheSidesExists) {
              this.convertPrismaLookupToEntityField(
                schema,
                model,
                field,
                preparedEntities,
                actionContext,
                existingEntities
              );
            }
          } else {
            this.convertPrismaLookupToEntityField(
              schema,
              model,
              field,
              preparedEntities,
              actionContext,
              existingEntities
            );
          }
        }
      }
    }

    return preparedEntities;
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
    actionContext,
  }: PrepareOperationIO): PrepareOperationIO {
    const schema = builder.getSchema();
    const modelList = schema.list.filter(
      (item) => item.type === MODEL_TYPE_NAME
    ) as Model[];
    modelList.map((model: Model) => {
      const formattedModelName = formatModelName(model.name);

      if (formattedModelName !== model.name) {
        let newModelName = formattedModelName;

        //if there is already entity with this name, use it as the new name
        if (!existingEntities.hasOwnProperty(formattedModelName)) {
          newModelName = handleModelNamesCollision(
            modelList,
            existingEntities,
            mapper,
            formattedModelName
          );
        }

        mapper.modelNames[model.name] = {
          originalName: model.name,
          newName: newModelName,
        };

        addMapAttributeToModel(builder, model, actionContext);

        void actionContext.onEmitUserActionLog(
          `Model name "${model.name}" was changed to "${newModelName}"`,
          EnumActionLogLevel.Info
        );

        builder.model(model.name).then<Model>((model) => {
          model.name = newModelName;
        });
      }
    });
    return {
      builder,
      existingEntities,
      mapper,
      actionContext,
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
    actionContext,
  }: PrepareOperationIO): PrepareOperationIO {
    const schema = builder.getSchema();
    const models = schema.list.filter((item) => item.type === MODEL_TYPE_NAME);
    models.map((model: Model) => {
      const originalModelName = findOriginalModelName(mapper, model.name);

      const modelFieldList = model.properties.filter(
        (property) =>
          property.type === FIELD_TYPE_NAME &&
          !property.attributes?.some((attr) => attr.name === ID_ATTRIBUTE_NAME)
      ) as Field[];
      modelFieldList.map((field: Field) => {
        // we don't want to rename field if it is a foreign key holder
        if (this.isFkFieldOfARelation(schema, model, field)) return builder;
        // we are not renaming enum fields because we are not supporting custom attributes on enum fields
        if (this.isOptionSetField(schema, field)) return builder;
        if (this.isMultiSelectOptionSetField(schema, field)) return builder;

        const formattedFieldName = formatFieldName(field.name);

        if (formattedFieldName !== field.name) {
          const isFormattedFieldNameAlreadyTaken = modelFieldList.some(
            (fieldFromModelFieldList) =>
              fieldFromModelFieldList.name === formattedFieldName
          );

          const newFieldName = isFormattedFieldNameAlreadyTaken
            ? `${formattedFieldName}Field`
            : formattedFieldName;

          mapper.fieldNames = {
            ...mapper.fieldNames,
            [originalModelName]: {
              ...(mapper.fieldNames[originalModelName] ?? {}),
              [field.name]: {
                originalName: field.name,
                newName: newFieldName,
              },
            },
          };

          void actionContext.onEmitUserActionLog(
            `Field name "${field.name}" on model ${model.name} was changed to "${newFieldName}"`,
            EnumActionLogLevel.Info
          );

          addMapAttributeToField(builder, schema, model, field, actionContext);

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
      actionContext,
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
    actionContext,
  }: PrepareOperationIO): PrepareOperationIO {
    const schema = builder.getSchema();
    const models = schema.list.filter((item) => item.type === MODEL_TYPE_NAME);

    Object.entries(mapper.modelNames).map(([originalName, { newName }]) => {
      models.map((model: Model) => {
        const originalModelName = findOriginalModelName(mapper, model.name);
        const originalFieldName = findOriginalFieldName(mapper, model.name);
        const fields = model.properties.filter(
          (property) => property.type === FIELD_TYPE_NAME
        ) as Field[];
        fields.map((field: Field) => {
          if (field.fieldType === originalName) {
            mapper.fieldTypes = {
              ...mapper.fieldTypes,
              [originalModelName]: {
                ...(mapper.fieldTypes[originalModelName] ?? {}),
                [originalFieldName]: {
                  ...(mapper.fieldTypes[originalModelName]?.[
                    originalFieldName
                  ] ?? {}),
                  [field.fieldType]: {
                    originalName: field.fieldType,
                    newName,
                  },
                },
              },
            };

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
      actionContext,
    };
  }

  /**
   * This function handle cases where the model doesn't have an id field (field with "@id" attribute),
   * but it has a composite id - unique identifier for a record in a database that is formed by combining multiple field values.
   * Model with composite id are decorated with `@@id` attribute on the model.
   * In this cases, we rename the `@@id` attribute to `@@unique`
   */
  private prepareModelIdAttribute({
    builder,
    existingEntities,
    mapper,
    actionContext,
  }: PrepareOperationIO): PrepareOperationIO {
    const schema = builder.getSchema();
    const models = schema.list.filter((item) => item.type === MODEL_TYPE_NAME);

    models.forEach((model: Model) => {
      const modelAttributes = model.properties.filter(
        (prop) =>
          prop.type === ATTRIBUTE_TYPE_NAME && prop.kind === OBJECT_KIND_NAME
      ) as BlockAttribute[];

      const modelIdAttribute = modelAttributes?.find(
        (attribute) => attribute.name === ID_ATTRIBUTE_NAME
      );

      if (!modelIdAttribute) return builder;

      const modelIdAttributeValueArgs = (
        modelIdAttribute.args.find((arg) => arg.type === "attributeArgument")
          ?.value as RelationArray
      )?.args;

      if (modelIdAttributeValueArgs.length > 1) {
        void actionContext.onEmitUserActionLog(
          `The model "${model.name}" has a composite id which is not supported. Please fix this issue and import the schema again.`,
          EnumActionLogLevel.Error
        );

        throw new Error(
          `The model "${model.name}" has a composite id which is not supported. Please fix this issue and import the schema again.`
        );
      }

      if (modelIdAttributeValueArgs.length === 1) {
        // rename the @@id attribute to @@unique
        builder.model(model.name).then<Model>((model) => {
          modelIdAttribute.name = UNIQUE_ATTRIBUTE_NAME;
        });

        void actionContext.onEmitUserActionLog(
          `Attribute "${ID_ATTRIBUTE_NAME}" was changed to "${UNIQUE_ATTRIBUTE_NAME}" on model "${model.name}"`,
          EnumActionLogLevel.Warning
        );

        const modelFields = model.properties.filter(
          (property) => property.type === FIELD_TYPE_NAME
        ) as Field[];

        const pkField = modelFields.find(
          (field) => field.name === modelIdAttributeValueArgs[0]
        );

        convertModelIdToFieldId(model, pkField, builder, actionContext);

        // change the name of the unique attribute arg to id
        builder.model(model.name).then<Model>((model) => {
          modelIdAttributeValueArgs[0] = ID_FIELD_NAME;
        });

        // then, on prepareIdField, we will handle the id field (for example id field that is not named id and the other way around)
      }
    });

    return {
      builder,
      existingEntities,
      mapper,
      actionContext,
    };
  }

  private prepareModelCompositeTypeAttributes({
    builder,
    existingEntities,
    mapper,
    actionContext,
  }: PrepareOperationIO): PrepareOperationIO {
    const schema = builder.getSchema();
    const models = schema.list.filter(
      (item) => item.type === MODEL_TYPE_NAME
    ) as Model[];

    models.forEach((model: Model) => {
      builder.model(model.name).then<Model>((modelItem) => {
        const modelAttributes = modelItem.properties.filter(
          (prop) =>
            prop.type === ATTRIBUTE_TYPE_NAME && prop.kind === OBJECT_KIND_NAME
        ) as BlockAttribute[];

        const modelReferenceAttributes = modelAttributes.filter(
          (attribute) =>
            attribute.name === ID_ATTRIBUTE_NAME ||
            attribute.name === UNIQUE_ATTRIBUTE_NAME ||
            attribute.name === INDEX_ATTRIBUTE_NAME
        );

        for (const prop of modelItem.properties) {
          if (
            prop.type === ATTRIBUTE_TYPE_NAME &&
            prop.kind === OBJECT_KIND_NAME
          ) {
            for (const attribute of modelReferenceAttributes) {
              const compositeArgs = attribute.args?.find(
                (arg) =>
                  arg.type === "attributeArgument" &&
                  (arg.value as RelationArray).type === ARRAY_ARG_TYPE_NAME
              );

              const functionArgs = attribute.args?.find(
                (arg) =>
                  compositeArgs &&
                  (
                    (arg.value as RelationArray).args as unknown as Array<Func>
                  )?.some((item) => item.type === FUNCTION_ARG_TYPE_NAME)
              );

              // range index: @@index([value_1(ops: Int4BloomOps)], type: Brin)
              const rangeIndexAttribute =
                attribute.name === INDEX_ATTRIBUTE_NAME && functionArgs;

              const originalModelName = findOriginalModelName(
                mapper,
                model.name
              );

              if (rangeIndexAttribute) {
                const rangeIndexArgArr = (
                  rangeIndexAttribute.value as RelationArray
                ).args as unknown as Array<Func>;

                for (const arg of rangeIndexArgArr) {
                  if (typeof arg.name === "string") {
                    const newFieldName =
                      mapper.fieldNames[originalModelName][arg.name]?.newName;

                    if (newFieldName) {
                      arg.name = newFieldName;
                    }
                  }
                }
              }

              if (compositeArgs && !rangeIndexAttribute) {
                const attrArgArr = (compositeArgs.value as RelationArray)?.args;

                // avoid formatting an arg when the field in the model was not formatted, for example: the fk field of a relation
                // or a field that represents an enum value
                for (const [index, arg] of attrArgArr.entries()) {
                  // in case of id field the manipulation is different, we don't change it from snake_case to camelCase, we actually rename the field name to id
                  // therefore we need to check if the id field in the current model was changed, and if so, we need to change the arg to id
                  const newIdFieldName = mapper.idFields[originalModelName]
                    ? mapper.idFields[originalModelName][arg]?.newName
                    : undefined;

                  if (newIdFieldName && newIdFieldName === ID_FIELD_NAME) {
                    attrArgArr[index] = newIdFieldName;
                  }

                  // check if a field (regular, not id) name was changed and if so, change the arg to the new field name
                  const newFieldName = mapper.fieldNames[originalModelName]
                    ? mapper.fieldNames[originalModelName][arg]?.newName
                    : undefined;

                  if (newFieldName && newFieldName === formatFieldName(arg)) {
                    attrArgArr[index] = newFieldName;
                  }
                }
              }
            }
          }
        }
      });
    });

    return {
      builder,
      existingEntities,
      mapper,
      actionContext,
    };
  }

  /**
   * Ensures the correct formatting and naming of ID fields in all models of the Prisma schema:
   * If a non-ID field is named id, it's renamed to ${modelName}Id to prevent any collisions with the actual ID field.
   * If an ID field (a field with an `@id` attribute) has a different name, it's renamed to id
   * In both cases, a `@map` attribute is added to the field with the original field name
   * And in the end we remove the `@default` attribute from any id field if it exists because we are adding it later as it's a part of the idType properties
   * @param builder - prisma schema builder
   * @returns the new builder if there was a change or the old one if there was no change
   */
  private prepareIdField({
    builder,
    existingEntities,
    mapper,
    actionContext,
  }: PrepareOperationIO): PrepareOperationIO {
    const schema = builder.getSchema();
    const models = schema.list.filter((item) => item.type === MODEL_TYPE_NAME);

    models.forEach((model: Model) => {
      const modelFields = model.properties.filter(
        (property) => property.type === FIELD_TYPE_NAME
      ) as Field[];

      const idFieldAsFK = modelFields.find(
        (field) =>
          field.attributes?.some((attr) => attr.name === ID_ATTRIBUTE_NAME) &&
          this.isFkFieldOfARelation(schema, model, field)
      );

      if (idFieldAsFK) {
        throw new Error(
          `Using the foreign key field as the primary key is not supported. The field "${idFieldAsFK.name}" is a primary key on model "${model.name}" but also a foreign key on the related model. Please fix this issue and import the schema again.`
        );
      }

      const hasIdField = modelFields.some(
        (field) =>
          field.attributes?.some((attr) => attr.name === ID_ATTRIBUTE_NAME) ??
          false
      );

      const hasUniqueFields = modelFields.some((field) => isUniqueField(field));

      // the model has no id field, but it has unique field/s
      if (!hasIdField && hasUniqueFields) {
        const uniqueFieldAsIdFieldNamedId = modelFields.find(
          (field) =>
            field.name === ID_FIELD_NAME &&
            isValidIdFieldType(field.fieldType as string) &&
            isUniqueField(field)
        );
        // first, we check if there is a unique field named id that can be converted to id field. If so, we prefer to use this field as id field
        if (uniqueFieldAsIdFieldNamedId) {
          convertUniqueFieldNamedIdToIdField(
            builder,
            model,
            uniqueFieldAsIdFieldNamedId,
            actionContext
          );
        } else {
          // if there is no unique field named id, we check if there is another unique field that we can convert to id field
          const uniqueFieldAsIdFieldNotNamedId = modelFields.find(
            (field) =>
              field.name !== ID_FIELD_NAME &&
              isValidIdFieldType(field.fieldType as string) &&
              isUniqueField(field)
          );
          if (uniqueFieldAsIdFieldNotNamedId) {
            convertUniqueFieldNotNamedIdToIdField(
              builder,
              schema,
              model,
              uniqueFieldAsIdFieldNotNamedId,
              mapper,
              actionContext
            );
          }
        }
        // the model has no id field and no unique field/s
      } else if (!hasIdField && !hasUniqueFields) {
        addIdFieldIfNotExists(builder, model, actionContext);
      } else {
        // the model has an id field. There are two cases: field named id that is not an id field, or id field that is not named id
        const notIdFieldNamedId = modelFields.find(
          (field) =>
            field.name === ID_FIELD_NAME &&
            !field.attributes?.some((attr) => attr.name === ID_ATTRIBUTE_NAME)
        );
        if (notIdFieldNamedId) {
          handleNotIdFieldNameId(
            builder,
            schema,
            model,
            notIdFieldNamedId,
            mapper,
            actionContext
          );
        }

        const idFieldNotNamedId = modelFields.find(
          (field) =>
            field.name !== ID_FIELD_NAME &&
            field.attributes?.some((attr) => attr.name === ID_ATTRIBUTE_NAME)
        );
        if (idFieldNotNamedId) {
          handleIdFieldNotNamedId(
            builder,
            schema,
            model,
            idFieldNotNamedId,
            mapper,
            actionContext
          );
        }
      }
    });
    return {
      builder,
      existingEntities,
      mapper,
      actionContext,
    };
  }

  private prepareRelationReferenceFields({
    builder,
    existingEntities,
    mapper,
    actionContext,
  }: PrepareOperationIO): PrepareOperationIO {
    const schema = builder.getSchema();
    const models = schema.list.filter(
      (item) => item.type === MODEL_TYPE_NAME
    ) as Model[];

    models.forEach((model: Model) => {
      const modelFields = model.properties.filter(
        (property) => property.type === FIELD_TYPE_NAME
      ) as Field[];

      for (const field of modelFields) {
        const annotatedRelationField = this.findAnnotatedRelationField(
          schema,
          field
        );

        if (!annotatedRelationField) continue;

        const remoteModel = models.find(
          (model: Model) =>
            formatModelName(model.name) ===
            formatModelName(field.fieldType as string)
        );

        if (!remoteModel) {
          throw new Error(
            `Remote model ${field.fieldType} not found for field ${field.name} on model ${model.name}`
          );
        }

        const relatedModelIdField = remoteModel.properties.find(
          (property) =>
            property.type === FIELD_TYPE_NAME &&
            property.attributes?.some(
              (attr) => attr.name === ID_ATTRIBUTE_NAME
            ) &&
            property.name === ID_FIELD_NAME
        ) as Field;

        if (!relatedModelIdField) {
          throw new Error(
            `Related model "${remoteModel.name}" doesn't have an id field`
          );
        }

        // find a map attribute on the relatedModelIdField and its value
        const relatedModelIdFieldMapAttributeName =
          relatedModelIdField.attributes?.find(
            (attr) => attr.name === MAP_ATTRIBUTE_NAME
          )?.name || "";

        const annotatedRelationFieldReferenceArray =
          annotatedRelationField.attributes
            ?.find((attr) => attr.name === RELATION_ATTRIBUTE_NAME)
            ?.args?.find((arg) => (arg.value as KeyValue).key === "references")
            ?.value as RelationArray;

        if (annotatedRelationFieldReferenceArray.args?.length > 1) {
          throw new Error(
            `The relation field "${annotatedRelationField.name}" on model "${model.name}" has more than one reference field. This is not supported.`
          );
        }

        if (
          annotatedRelationFieldReferenceArray &&
          annotatedRelationFieldReferenceArray.args
        ) {
          for (const [
            index,
            arg,
          ] of annotatedRelationFieldReferenceArray.args.entries()) {
            if (arg[index] === relatedModelIdFieldMapAttributeName) {
              annotatedRelationFieldReferenceArray[index] =
                relatedModelIdField.name;
            }
          }
        }
      }
    });

    return {
      builder,
      existingEntities,
      mapper,
      actionContext,
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
    return lookupField(schema, field) === EnumDataType.Lookup;
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

  private findAnnotatedRelationField(
    schema: Schema,
    field: Field
  ): Field | null {
    const hasRelationAttributeWithRelationNameAndWithoutReferenceField =
      field.attributes?.some(
        (attr) =>
          attr.name === RELATION_ATTRIBUTE_NAME &&
          !attr.args?.some((arg) => typeof arg.value === "string") &&
          attr.args?.find(
            (arg) => (arg.value as KeyValue).key === ARG_KEY_FIELD_NAME
          )
      ) ?? false;

    // check if the field is a relation field AND it has the @relation attribute with reference field
    return (
      this.isLookupField(schema, field) &&
      hasRelationAttributeWithRelationNameAndWithoutReferenceField &&
      field
    );
  }

  private isNotAnnotatedRelationField(schema: Schema, field: Field): boolean {
    const modelList = schema.list.filter(
      (item) => item.type === MODEL_TYPE_NAME
    );

    const relationAttribute =
      field.attributes?.some((attr) => attr.name === RELATION_ATTRIBUTE_NAME) ??
      false;

    const hasRelationAttributeNameAndWithoutReferenceField =
      field.attributes?.some(
        (attr) =>
          attr.name === RELATION_ATTRIBUTE_NAME &&
          findRelationAttributeName(attr) &&
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
      (fieldModelType && hasRelationAttributeNameAndWithoutReferenceField)
    );
  }

  private isManyToManyRelation(
    schema: Schema,
    model: Model,
    field: Field
  ): boolean {
    let isManyToMany = false;
    // check if the current field is a relation field that is not annotated and it is an array
    const isCurrentFieldIsRelationArray =
      this.isLookupField(schema, field) &&
      this.isNotAnnotatedRelationField(schema, field) &&
      field.array;

    // if the current field is not an array, it can't be a many to many relation, exit the function and return false
    if (!isCurrentFieldIsRelationArray) return isManyToMany;

    const modelList = schema.list.filter(
      (item) => item.type === MODEL_TYPE_NAME
    ) as Model[];

    const remoteModel = modelList.find(
      (modelItem: Model) =>
        formatModelName(modelItem.name) ===
        formatModelName(field.fieldType as string)
    );

    if (!remoteModel) {
      throw new Error(
        `Remote model ${field.fieldType} not found for field ${field.name} on model ${model.name}`
      );
    }

    const remoteModelFields = remoteModel.properties.filter(
      (property) => property.type === FIELD_TYPE_NAME
    ) as Field[];

    // from the remote model fields, find the fields that are relations to the current model (it can be more than one field)
    const remoteRelatedFields = remoteModelFields.filter(
      (fieldItem: Field) =>
        formatModelName(model.name) ===
        formatModelName(fieldItem.fieldType as string)
    );

    if (!remoteRelatedFields.length) {
      throw new Error(
        `The other side of the relation not found for field ${field.name} on model ${model.name}`
      );
    }

    if (remoteRelatedFields.length === 1) {
      const isRemoteFieldIsRelationArray =
        this.isLookupField(schema, remoteRelatedFields[0]) &&
        this.isNotAnnotatedRelationField(schema, remoteRelatedFields[0]) &&
        remoteRelatedFields[0].array;

      isManyToMany = !!isRemoteFieldIsRelationArray;
    }

    if (remoteRelatedFields.length > 1) {
      // compare between the relation name of the two sides
      let currentFieldRelationAttributeName = null;
      let remoteFieldRelationAttributeName = null;
      const relationAttribute = field.attributes?.find(
        (attr) => attr.name === RELATION_ATTRIBUTE_NAME
      );

      if (relationAttribute) {
        currentFieldRelationAttributeName =
          findRelationAttributeName(relationAttribute);
      }

      // loop over the otherSide array, for each field find the relation name and compare it to the relation name of the field
      // if they are equal, it means that we found the other side of the relation
      for (const [index, fieldItem] of remoteRelatedFields.entries()) {
        const relationAttributeOnRemoteField = fieldItem.attributes?.find(
          (attr) => attr.name === RELATION_ATTRIBUTE_NAME
        );

        if (relationAttributeOnRemoteField) {
          remoteFieldRelationAttributeName = findRelationAttributeName(
            relationAttributeOnRemoteField
          );
        }

        const isCurrentFieldRelationAttrNameEqualRemoteFieldRelationAttrName =
          currentFieldRelationAttributeName ===
          remoteFieldRelationAttributeName;

        const isRemoteFieldItemIsRelationArray =
          this.isLookupField(schema, remoteRelatedFields[index]) &&
          this.isNotAnnotatedRelationField(
            schema,
            remoteRelatedFields[index]
          ) &&
          remoteRelatedFields[index].array;

        isManyToMany =
          isCurrentFieldRelationAttrNameEqualRemoteFieldRelationAttrName &&
          isRemoteFieldItemIsRelationArray;
      }
    }
    return isManyToMany;
  }

  private isFkFieldOfARelation(
    schema: Schema,
    model: Model,
    field: Field
  ): boolean {
    const modelFields = model.properties.filter(
      (property) => property.type === FIELD_TYPE_NAME
    ) as Field[];

    const relationFiledWithReference = modelFields.find((modelField: Field) =>
      modelField.attributes?.find(
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

    return !!relationFiledWithReference;
  }

  /********************
   * CONVERSION SECTION *
   ********************/

  /**
   * convert a model in the Prisma schema to an entity used within Amplication
   * @param model the model to prepare
   * @returns entity in a structure of CreateBulkEntitiesInput
   */
  private convertModelToEntity(
    model: Model,
    existingEntities: ExistingEntitiesWithFieldsMap
  ): CreateBulkEntitiesInput {
    const modelDisplayName = formatDisplayName(model.name);
    const modelAttributes = model.properties.filter(
      (prop) =>
        prop.type === ATTRIBUTE_TYPE_NAME && prop.kind === OBJECT_KIND_NAME
    ) as BlockAttribute[];
    const entityPluralDisplayName = pluralize(model.name);
    const entityAttributes = prepareModelAttributes(modelAttributes).join(" ");

    let id = cuid(); // creating here the entity id because we need it for the relation

    if (existingEntities[model.name]) {
      //use the ID of the existing entity
      id = existingEntities[model.name].id;
    }

    return {
      id,
      name: model.name,
      displayName: modelDisplayName,
      pluralDisplayName:
        entityPluralDisplayName === model.name
          ? `${entityPluralDisplayName} Items`
          : entityPluralDisplayName,
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
    actionContext: ActionContext,
    existingEntities: ExistingEntitiesWithFieldsMap
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      void actionContext.onEmitUserActionLog(
        `Entity ${model.name} not found`,
        EnumActionLogLevel.Error
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = createOneEntityFieldCommonProperties(
      field,
      EnumDataType.Boolean,
      model,
      existingEntities
    );

    entity.fields.push(entityField);

    return entity;
  }

  private convertPrismaCreatedAtToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateBulkEntitiesInput[],
    actionContext: ActionContext,
    existingEntities: ExistingEntitiesWithFieldsMap
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      void actionContext.onEmitUserActionLog(
        `Entity ${model.name} not found`,
        EnumActionLogLevel.Error
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = createOneEntityFieldCommonProperties(
      field,
      EnumDataType.CreatedAt,
      model,
      existingEntities
    );

    entity.fields.push(entityField);

    return entity;
  }

  private convertPrismaUpdatedAtToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateBulkEntitiesInput[],
    actionContext: ActionContext,
    existingEntities: ExistingEntitiesWithFieldsMap
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      void actionContext.onEmitUserActionLog(
        `Entity ${model.name} not found`,
        EnumActionLogLevel.Error
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = createOneEntityFieldCommonProperties(
      field,
      EnumDataType.UpdatedAt,
      model,
      existingEntities
    );

    entity.fields.push(entityField);

    return entity;
  }

  private convertPrismaDateTimeToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateBulkEntitiesInput[],
    actionContext: ActionContext,
    existingEntities: ExistingEntitiesWithFieldsMap
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      void actionContext.onEmitUserActionLog(
        `Entity ${model.name} not found`,
        EnumActionLogLevel.Error
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = createOneEntityFieldCommonProperties(
      field,
      EnumDataType.DateTime,
      model,
      existingEntities
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
    actionContext: ActionContext,
    existingEntities: ExistingEntitiesWithFieldsMap
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      void actionContext.onEmitUserActionLog(
        `Entity ${model.name} not found`,
        EnumActionLogLevel.Error
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = createOneEntityFieldCommonProperties(
      field,
      EnumDataType.DecimalNumber,
      model,
      existingEntities
    );

    const properties = <types.DecimalNumber>{
      databaseFieldType: DecimalNumberType[field.fieldType as string],
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
    actionContext: ActionContext,
    existingEntities: ExistingEntitiesWithFieldsMap
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      void actionContext.onEmitUserActionLog(
        `Entity ${model.name} not found`,
        EnumActionLogLevel.Error
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = createOneEntityFieldCommonProperties(
      field,
      EnumDataType.WholeNumber,
      model,
      existingEntities
    );

    const properties = <types.WholeNumber>{
      databaseFieldType: WholeNumberType[field.fieldType as string],
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
    actionContext: ActionContext,
    existingEntities: ExistingEntitiesWithFieldsMap
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      void actionContext.onEmitUserActionLog(
        `Entity ${model.name} not found`,
        EnumActionLogLevel.Error
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = createOneEntityFieldCommonProperties(
      field,
      EnumDataType.SingleLineText,
      model,
      existingEntities
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
    actionContext: ActionContext,
    existingEntities: ExistingEntitiesWithFieldsMap
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      void actionContext.onEmitUserActionLog(
        `Entity ${model.name} not found`,
        EnumActionLogLevel.Error
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = createOneEntityFieldCommonProperties(
      field,
      EnumDataType.Json,
      model,
      existingEntities
    );

    entity.fields.push(entityField);

    return entity;
  }

  private convertPrismaIdToEntityField(
    schema: Schema,
    model: Model,
    field: Field,
    preparedEntities: CreateBulkEntitiesInput[],
    actionContext: ActionContext,
    existingEntities: ExistingEntitiesWithFieldsMap
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      void actionContext.onEmitUserActionLog(
        `Entity ${model.name} not found`,
        EnumActionLogLevel.Error
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = createOneEntityFieldCommonProperties(
      field,
      EnumDataType.Id,
      model,
      existingEntities,
      this.datasourceProvider
    );

    const defaultIdAttribute = field.attributes?.find(
      (attr) => attr.name === DEFAULT_ATTRIBUTE_NAME
    );

    if (!defaultIdAttribute) {
      const properties = <types.Id>{
        idType: idTypePropertyMapByPrismaFieldType[field.fieldType as string],
      };
      entityField.properties = properties as unknown as {
        [key: string]: JsonValue;
      };
    }

    if (defaultIdAttribute && defaultIdAttribute.args) {
      let idType: types.Id["idType"];
      const defaultValue = defaultIdAttribute.args[0].value;
      const defaultValueFunctionName = (defaultValue as Func).name;
      const idTypeDefaultArg =
        typeof defaultValue === "string"
          ? defaultValue
          : defaultValueFunctionName;
      if (field.fieldType === PRISMA_TYPE_STRING) {
        if (
          idTypeDefaultArg === ID_DEFAULT_VALUE_CUID ||
          idTypeDefaultArg === ID_DEFAULT_VALUE_CUID_FUNCTION
        ) {
          idType = ID_TYPE_CUID;
        } else if (
          idTypeDefaultArg === ID_DEFAULT_VALUE_UUID ||
          idTypeDefaultArg === ID_DEFAULT_VALUE_UUID_FUNCTION
        ) {
          idType = ID_TYPE_UUID;
        } else {
          idType = ID_TYPE_CUID;
        }
      } else if (field.fieldType === PRISMA_TYPE_INT) {
        if (
          idTypeDefaultArg === ID_DEFAULT_VALUE_AUTO_INCREMENT ||
          idTypeDefaultArg === ID_DEFAULT_VALUE_AUTO_INCREMENT_FUNCTION
        ) {
          idType = ID_TYPE_AUTO_INCREMENT;
        }
      } else if (field.fieldType === PRISMA_TYPE_BIG_INT) {
        if (
          idTypeDefaultArg === ID_DEFAULT_VALUE_AUTO_INCREMENT ||
          idTypeDefaultArg === ID_DEFAULT_VALUE_AUTO_INCREMENT_FUNCTION
        ) {
          idType = ID_TYPE_AUTO_INCREMENT_BIG_INT;
        }
      }

      if (!idType) {
        idType = prismaIdTypeToDefaultIdType[field.fieldType as string];
      }

      const properties = <types.Id>{
        idType,
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
    actionContext: ActionContext,
    existingEntities: ExistingEntitiesWithFieldsMap
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      void actionContext.onEmitUserActionLog(
        `Entity ${model.name} not found`,
        EnumActionLogLevel.Error
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = createOneEntityFieldCommonProperties(
      field,
      EnumDataType.OptionSet,
      model,
      existingEntities
    );

    const enums = schema.list.filter((item) => item.type === ENUM_TYPE_NAME);
    const enumOfTheField = enums.find(
      (item: Enum) => item.name === field.fieldType
    ) as Enum;

    if (!enumOfTheField) {
      this.logger.error(`Enum ${field.name} not found`);
      throw new Error(`Enum ${field.name} not found`);
    }

    const enumOptions = handleEnumMapAttribute(enumOfTheField, actionContext);

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
    actionContext: ActionContext,
    existingEntities: ExistingEntitiesWithFieldsMap
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
      void actionContext.onEmitUserActionLog(
        `Entity ${model.name} not found`,
        EnumActionLogLevel.Error
      );
      throw new Error(`Entity ${model.name} not found`);
    }

    const entityField = createOneEntityFieldCommonProperties(
      field,
      EnumDataType.MultiSelectOptionSet,
      model,
      existingEntities
    );

    const enums = schema.list.filter((item) => item.type === ENUM_TYPE_NAME);
    const enumOfTheField = enums.find(
      (item: Enum) => item.name === field.fieldType
    ) as Enum;

    if (!enumOfTheField) {
      this.logger.error(`Enum ${field.name} not found`);
      throw new Error(`Enum ${field.name} not found`);
    }

    const enumOptions = handleEnumMapAttribute(enumOfTheField, actionContext);

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
    actionContext: ActionContext,
    existingEntities: ExistingEntitiesWithFieldsMap
  ): CreateBulkEntitiesInput {
    try {
      const entity = preparedEntities.find(
        (entity) => entity.name === model.name
      ) as CreateBulkEntitiesInput;

      if (!entity) {
        this.logger.error(`Entity ${model.name} not found`);
        void actionContext.onEmitUserActionLog(
          `Entity ${model.name} not found`,
          EnumActionLogLevel.Error
        );
        throw new Error(`Entity ${model.name} not found`);
      }
      // create the relation filed on the main side of the relation
      const entityField = createOneEntityFieldCommonProperties(
        field,
        EnumDataType.Lookup,
        model,
        existingEntities
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
        EnumDataType.Lookup,
        model,
        existingEntities
      );

      entityField.relatedFieldName = relatedField.name;
      entityField.relatedFieldDisplayName = relatedField.displayName;
      entityField.relatedFieldAllowMultipleSelection =
        remoteField.array || false;

      const relatedEntity = preparedEntities.find(
        (entity) => entity.name === remoteModel.name
      ) as CreateBulkEntitiesInput;

      const isManyToMany = this.isManyToManyRelation(schema, model, field);

      const fkFieldName = !isManyToMany
        ? findFkFieldNameOnAnnotatedField(field)
        : "";

      const fkHolder = !isManyToMany
        ? entityField.permanentId // we are on the "main", annotated side of the relation, meaning that this field is the fkHolder
        : null;

      const properties = <types.Lookup>{
        relatedEntityId: relatedEntity.id,
        allowMultipleSelection: field.array || false,
        fkHolder,
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

      void actionContext.onEmitUserActionLog(
        error.message,
        EnumActionLogLevel.Error
      );
      throw error;
    }
  }
}
