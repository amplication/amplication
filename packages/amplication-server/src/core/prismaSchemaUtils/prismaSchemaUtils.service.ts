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
} from "@mrleebo/prisma-ast";
import {
  filterOutAmplicationAttributes,
  formatDisplayName,
  formatFieldName,
  formatModelName,
  idTypePropertyMap,
  idTypePropertyMapByFieldType,
  isCamelCaseWithIdSuffix,
} from "./schema-utils";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import pluralize from "pluralize";
import {
  ConvertPrismaSchemaForImportObjectsResponse,
  Mapper,
  Operation,
  OperationIO,
} from "./types";
import { ScalarType } from "prisma-schema-dsl-types";
import { EnumDataType } from "../../enums/EnumDataType";
import cuid from "cuid";
import { types } from "@amplication/code-gen-types";
import { JsonValue } from "type-fest";
import {
  CreateBulkEntitiesInput,
  CreateBulkFieldsInput,
} from "../entity/entity.service";
import {
  ENUM_TYPE_NAME,
  FIELD_TYPE_NAME,
  ID_ATTRIBUTE_NAME,
  ID_FIELD_NAME,
  MODEL_TYPE_NAME,
} from "./constants";
import { ActionLog } from "../action/dto";

@Injectable()
export class PrismaSchemaUtilsService {
  private operations: Operation[] = [
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
    schema: string
  ): ConvertPrismaSchemaForImportObjectsResponse {
    this.validateSchemaUpload(schema);
    const errors = this.validateSchemaProcessing(schema);
    const preparedSchema = this.prepareSchema(...this.operations)(schema);
    const preparedSchemaObject = preparedSchema.builder.getSchema();
    return {
      preparedEntitiesWithFields:
        this.convertPreparedSchemaForImportObjects(preparedSchemaObject),
      log: [...preparedSchema.log, ...errors],
    };
  }

  /**
   * Prepare schema before passing it to entities and fields creation
   * @param operations functions with a declared interface (builder: ConcretePrismaSchemaBuilder) => ConcretePrismaSchemaBuilder
   * The functions are called one after the other and perform operations on the schema
   * The functions have a name pattern: handle{OperationName}
   * @returns function that accepts the initial schema and returns the prepared schema
   */
  private prepareSchema(
    ...operations: Operation[]
  ): (inputSchema: string) => OperationIO {
    return (inputSchema: string): OperationIO => {
      const builder = createPrismaSchemaBuilder(
        inputSchema
      ) as ConcretePrismaSchemaBuilder;
      const mapper: Mapper = {
        modelNames: {},
        fieldNames: {},
        fieldTypes: {},
        idFields: {},
      };
      const log: ActionLog[] = [];

      operations.forEach((operation) => {
        operation.call(this, { builder, mapper, log });
      });

      return { builder, mapper, log };
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
    schema: Schema
  ): CreateBulkEntitiesInput[] {
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

        if (this.isBooleanField(schema, field)) {
          this.convertPrismaBooleanToEntityField(
            schema,
            model,
            field,
            preparedEntities
          );
        } else if (this.isCreatedAtField(schema, field)) {
          this.convertPrismaCreatedAtToEntityField(
            schema,
            model,
            field,
            preparedEntities
          );
        } else if (this.isUpdatedAtField(schema, field)) {
          this.convertPrismaUpdatedAtToEntityField(
            schema,
            model,
            field,
            preparedEntities
          );
        } else if (this.isDateTimeField(schema, field)) {
          this.convertPrismaDateTimeToEntityField(
            schema,
            model,
            field,
            preparedEntities
          );
        } else if (this.isDecimalNumberField(schema, field)) {
          this.convertPrismaDecimalNumberToEntityField(
            schema,
            model,
            field,
            preparedEntities
          );
        } else if (this.isWholeNumberField(schema, field)) {
          this.convertPrismaWholeNumberToEntityField(
            schema,
            model,
            field,
            preparedEntities
          );
        } else if (this.isSingleLineTextField(schema, field)) {
          this.convertPrismaSingleLineTextToEntityField(
            schema,
            model,
            field,
            preparedEntities
          );
        } else if (this.isJsonField(schema, field)) {
          this.convertPrismaJsonToEntityField(
            schema,
            model,
            field,
            preparedEntities
          );
        } else if (this.isIdField(schema, field)) {
          this.convertPrismaIdToEntityField(
            schema,
            model,
            field,
            preparedEntities
          );
        } else if (this.isOptionSetField(schema, field)) {
          this.convertPrismaOptionSetToEntityField(
            schema,
            model,
            field,
            preparedEntities
          );
        } else if (this.isMultiSelectOptionSetField(schema, field)) {
          this.convertPrismaMultiSelectOptionSetToEntityField(
            schema,
            model,
            field,
            preparedEntities
          );
        } else if (this.isLookupField(schema, field)) {
          this.convertPrismaLookupToEntityField(
            schema,
            model,
            field,
            preparedEntities
          );
        }
      }
    }

    return preparedEntities;
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
    mapper,
    log,
  }: OperationIO): OperationIO {
    const schema = builder.getSchema();
    const models = schema.list.filter((item) => item.type === MODEL_TYPE_NAME);
    models.map((model: Model) => {
      const formattedModelName = formatModelName(model.name);

      if (formattedModelName !== model.name) {
        mapper.modelNames[model.name] = {
          oldName: model.name,
          newName: formattedModelName,
        };

        log.push({
          id: cuid(),
          message: `Model name "${model.name}" was changed to "${formattedModelName}"`,
          level: "Info",
          createdAt: new Date(),
          meta: {},
        });

        builder.model(model.name).blockAttribute("map", model.name);
        builder.model(model.name).then<Model>((model) => {
          model.name = formatModelName(model.name);
        });
      }
    });
    return {
      builder,
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
    mapper,
    log,
  }: OperationIO): OperationIO {
    const schema = builder.getSchema();
    const models = schema.list.filter((item) => item.type === MODEL_TYPE_NAME);
    models.map((model: Model) => {
      const fields = model.properties.filter(
        (property) =>
          property.type === FIELD_TYPE_NAME &&
          !property.attributes?.some((attr) => attr.name === ID_ATTRIBUTE_NAME)
      ) as Field[];
      fields.map((field: Field) => {
        // we don't want to rename field if it is a foreign key holder
        if (this.isFkFieldOfARelation(schema, model, field)) return builder;
        if (this.resolveFieldDataType(schema, field) === EnumDataType.OptionSet)
          return builder;
        if (
          this.resolveFieldDataType(schema, field) ===
          EnumDataType.MultiSelectOptionSet
        )
          return builder;

        const formattedFieldName = formatFieldName(field.name);

        if (formattedFieldName !== field.name) {
          mapper.fieldNames[field.name] = {
            oldName: field.name,
            newName: formattedFieldName,
          };

          log.push({
            id: cuid(),
            message: `Field name "${field.name}" was changed to "${formattedFieldName}"`,
            level: "Info",
            createdAt: new Date(),
            meta: {},
          });
          builder
            .model(model.name)
            .field(field.name)
            .attribute("map", [`"${field.name}"`]);
          builder
            .model(model.name)
            .field(field.name)
            .then<Field>((field) => {
              field.name = formatFieldName(field.name);
            });
        }
      });
    });
    return {
      builder,
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
    mapper,
    log,
  }: OperationIO): OperationIO {
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

            log.push({
              id: cuid(),
              message: `field type "${field.fieldType}" on model name ${model.name} was changed to "${newName}"`,
              level: "Info",
              createdAt: new Date(),
              meta: {},
            });

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
      mapper,
      log,
    };
  }

  /**
   * Search for the id of the table (decorated with @id) and if it is not named "id" rename it to "id" and add "@map" attribute
   * @param builder - prisma schema builder
   * @returns the new builder if there was a change or the old one if there was no change
   */
  private prepareIdField({ builder, mapper, log }: OperationIO): OperationIO {
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

          log.push({
            id: cuid(),
            message: `field name "${field.name}" on model name ${model.name} was changed to "${model.name}Id"`,
            level: "Info",
            createdAt: new Date(),
            meta: {},
          });
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

          log.push({
            id: cuid(),
            message: `field name "${field.name}" on model name ${model.name} was changed to "id"`,
            level: "Info",
            createdAt: new Date(),
            meta: {},
          });
        }
      });
    });
    return {
      builder,
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
      (prop) => prop.type === "attribute"
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
    const isUniqueField = field.attributes?.some(
      (attr) => attr.name === "unique"
    );

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
      required: field.optional || false,
      unique: isUniqueField,
      searchable: false,
      description: "",
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
        (attribute) => attribute.name === ID_ATTRIBUTE_NAME
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

    const lookupModelType = () => {
      const modelList = schema.list.filter(
        (item) => item.type === MODEL_TYPE_NAME
      );
      const fieldModelType = modelList.find((model: Model) => {
        return (
          formatModelName(model.name) ===
          formatModelName(field.fieldType as string)
        );
      });

      if (fieldModelType) {
        return EnumDataType.Lookup;
      }
    };

    const createAtType = () => {
      const createdAtDefaultAttribute = field.attributes?.find(
        (attribute) => attribute.name === "default"
      );

      const createdAtNowArg = createdAtDefaultAttribute?.args?.some(
        (arg) => (arg.value as Func).name === "now"
      );

      if (createdAtDefaultAttribute && createdAtNowArg) {
        return EnumDataType.CreatedAt;
      }
    };

    const updatedAtType = () => {
      const updatedAtAttribute = field.attributes?.some(
        (attribute) => attribute.name === "updatedAt"
      );

      const updatedAtDefaultAttribute = field.attributes?.find(
        (attribute) => attribute.name === "default"
      );

      const updatedAtNowArg = updatedAtDefaultAttribute?.args?.some(
        (arg) => (arg.value as Func).name === "now"
      );

      if (
        updatedAtAttribute ||
        (updatedAtDefaultAttribute && updatedAtNowArg)
      ) {
        return EnumDataType.UpdatedAt;
      }
    };

    const optionSetType = () => {
      const enumList = schema.list.filter(
        (item) => item.type === ENUM_TYPE_NAME
      );
      const fieldOptionSetType = enumList.find(
        (enumItem: Enum) => enumItem.name === field.fieldType
      );
      if (fieldOptionSetType) {
        return EnumDataType.OptionSet;
      }
    };

    const multiSelectOptionSetType = () => {
      const enumList = schema.list.filter(
        (item) => item.type === ENUM_TYPE_NAME
      );
      const isMultiSelect = field.array || false;
      const fieldOptionSetType = enumList.find(
        (enumItem: Enum) => enumItem.name === field.fieldType && isMultiSelect
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
      lookupModelType,
      optionSetType,
      multiSelectOptionSetType,
      createAtType,
      updatedAtType,
      // must be the one before the last
      scalarType,
      // must be last
      () => {
        throw new Error(
          `Unsupported data type: ${field.fieldType} of field: ${field.name}`
        );
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

  private isCreatedAtField(schema: Schema, field: Field): boolean {
    return this.resolveFieldDataType(schema, field) === EnumDataType.CreatedAt;
  }

  private isUpdatedAtField(schema: Schema, field: Field): boolean {
    return this.resolveFieldDataType(schema, field) === EnumDataType.UpdatedAt;
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
    const modelList = schema.list.filter(
      (item) => item.type === MODEL_TYPE_NAME
    );
    const relationAttribute = field.attributes?.some(
      (attr) => attr.name === "relation"
    );

    const hasRelationAttributeWithRelationName = field.attributes?.some(
      (attr) =>
        attr.name === "relation" &&
        attr.args.some((arg) => typeof arg.value === "string")
    );

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
          attr.args.some(
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
    preparedEntities: CreateBulkEntitiesInput[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
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
    preparedEntities: CreateBulkEntitiesInput[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
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
    preparedEntities: CreateBulkEntitiesInput[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
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
    preparedEntities: CreateBulkEntitiesInput[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
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
    preparedEntities: CreateBulkEntitiesInput[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
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
    preparedEntities: CreateBulkEntitiesInput[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
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
    preparedEntities: CreateBulkEntitiesInput[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
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
    preparedEntities: CreateBulkEntitiesInput[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
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
    preparedEntities: CreateBulkEntitiesInput[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
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
    preparedEntities: CreateBulkEntitiesInput[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
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
    preparedEntities: CreateBulkEntitiesInput[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
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
    preparedEntities: CreateBulkEntitiesInput[]
  ): CreateBulkEntitiesInput {
    const entity = preparedEntities.find(
      (entity) => entity.name === model.name
    ) as CreateBulkEntitiesInput;

    if (!entity) {
      this.logger.error(`Entity ${model.name} not found`);
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
    entityField.relatedFieldAllowMultipleSelection = remoteField.array || false;

    const relatedEntity = preparedEntities.find(
      (entity) => entity.name === remoteModel.name
    ) as CreateBulkEntitiesInput;

    const properties = <types.Lookup>{
      relatedEntityId: relatedEntity.id,
      allowMultipleSelection: field.array || false,
      fkHolder: null,
    };

    entityField.properties = properties as unknown as {
      [key: string]: JsonValue;
    };

    entity.fields.push(entityField);

    return entity;
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

    // in the main relation, check if the relation annotation has a name
    field.attributes?.find((attr) => {
      const relationAttribute = attr.name === "relation";
      const relationAttributeStringArgument =
        relationAttribute &&
        attr.args.find((arg) => typeof arg.value === "string");

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
            attr.args.find((arg) => arg.value === relationAttributeName)
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

      if (!remoteField) {
        throw new Error(
          `No field found in model ${remoteModel.name} that reference ${model.name}`
        );
      }
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
      throw new Error("Invalid schema");
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
      errors.push({
        id: cuid(),
        message: "A schema must contain at least one model",
        level: "Error",
        createdAt: new Date(),
        meta: {},
      });
    }

    models.map((model: Model) => {
      // const isModelAlreadyExists = this.validateModelExistence(
      //   models,
      //   model.name
      // );

      // if (isModelAlreadyExists) {
      //   errors.push(isModelAlreadyExists);
      //   throw new Error(`Model ${model.name} already exists`);
      // }

      const fields = model.properties.filter(
        (property) => property.type === FIELD_TYPE_NAME
      ) as Field[];

      fields.map((field: Field) => {
        // const invalidFkFieldNameErrors = this.validateFKFieldName(
        //   schemaObject,
        //   model,
        //   field
        // );
        // if (invalidFkFieldNameErrors) {
        //   errors.push(invalidFkFieldNameErrors);
        //   throw new Error(
        //     `Invalid foreign key field name ${field.name} in model ${model.name}. The Foreign key field name must be in camelCase and end with Id`
        //   );
        // }
      });
    });

    return errors.length > 0 ? errors : [];
  }

  private validateModelExistence(
    models: Model[],
    modelName: string
  ): ActionLog {
    const modelExists = models.some(
      (model) => formatModelName(model.name) === formatModelName(modelName)
    );

    if (modelExists) {
      return {
        id: cuid(),
        message: `Model ${modelName} already exists`,
        level: "Error",
        createdAt: new Date(),
        meta: {},
      };
    }
  }

  // TODO: handle this case. Issue opened: https://github.com/amplication/amplication/issues/6334
  private validateFKFieldName(
    schema: Schema,
    model: Model,
    field: Field
  ): ActionLog {
    const isValidFkFieldName = isCamelCaseWithIdSuffix(field);
    const isFkHolder = this.isFkFieldOfARelation(schema, model, field);

    if (!isValidFkFieldName && isFkHolder) {
      return {
        id: cuid(),
        message: `Field name: "${field.name}" in model: "${model.name}" must be in camelCase and end with "Id"`,
        level: "Error",
        createdAt: new Date(),
        meta: {},
      };
    }
  }
}
