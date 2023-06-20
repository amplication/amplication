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
  isCamelCaseWithIdSuffix,
} from "./schema-utils";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import pluralize from "pluralize";
import {
  CreateEntityFieldInput,
  CreateEntityInput,
  ErrorLevel,
  ErrorMessages,
  Operation,
} from "./types";
import { ErrorMessage } from "./ErrorMessages";
import { ScalarType } from "prisma-schema-dsl-types";
import { EnumDataType } from "../../enums/EnumDataType";
import cuid from "cuid";

@Injectable()
export class PrismaSchemaUtilsService {
  private operations: Operation[] = [
    this.handleModelNamesRenaming,
    this.handleFieldNamesRenaming,
    this.handleFieldTypesRenaming,
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
    const modelList = schema.list.filter(
      (item: Model) => item.type === "model"
    ) as Model[];

    const preparedEntities = modelList.map((model: Model) =>
      this.prepareEntity(model)
    );

    for (const model of modelList) {
      const modelFields = model.properties.filter(
        (property) => property.type === "field"
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
        }

        if (this.isCreatedAtField(schema, field)) {
          this.convertPrismaCreatedAtToEntityField(
            schema,
            model,
            field,
            preparedEntities
          );
        }

        if (this.isUpdatedAtField(schema, field)) {
          this.convertPrismaUpdatedAtToEntityField(
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
      }
    }

    /*****************************************
      if (MultiLineText(field)) {}
      if (isEmailField(field)) {}
      if (isPasswordField(field)) {}
      if (isUsernameField(field)) {}
      if (isRolesField(field)) {}
      if (isGeographicLocationField(field)) {}
    ******************************************/

    return preparedEntities;
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
        // we don't want to rename field if it is a foreign key holder
        const isFkHolder = this.isFkFieldOfARelation(schema, model, field);
        const isInvalidFieldName = field.name.includes("_");
        const isEnumFieldType =
          this.resolveFieldDataType(schema, field) === EnumDataType.OptionSet ||
          this.resolveFieldDataType(schema, field) ===
            EnumDataType.MultiSelectOptionSet;
        if (isInvalidFieldName && !isEnumFieldType && !isFkHolder) {
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

  private handleFieldTypesRenaming(
    builder: ConcretePrismaSchemaBuilder
  ): ConcretePrismaSchemaBuilder {
    const schema = builder.getSchema();
    const models = schema.list.filter((item) => item.type === "model");
    models.map((model: Model) => {
      const fields = model.properties.filter(
        (property) => property.type === "field"
      ) as Field[];

      return fields.map((field: Field) => {
        const isEnumFieldType =
          this.resolveFieldDataType(schema, field) === EnumDataType.OptionSet ||
          this.resolveFieldDataType(schema, field) ===
            EnumDataType.MultiSelectOptionSet;
        if (!isEnumFieldType) {
          builder
            .model(model.name)
            .field(field.name)
            .then<Field>((field) => {
              field.fieldType = formatModelName(field.fieldType as string);
            });
          return builder;
        }
        return builder;
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

    models.forEach((model: Model) => {
      const modelFields = model.properties.filter(
        (property) => property.type === "field"
      ) as Field[];

      const notIdFieldIsNamedId = modelFields.find((field: Field) => {
        return (
          field.name === "id" &&
          !field.attributes?.some((attr) => attr.name === "id")
        );
      });

      if (notIdFieldIsNamedId) {
        builder
          .model(model.name)
          .field(notIdFieldIsNamedId.name)
          .attribute("map", [notIdFieldIsNamedId.name]);
        builder
          .model(model.name)
          .field(notIdFieldIsNamedId.name)
          .then<Field>((field) => {
            field.name = `${model.name}Id`;
          });
      }

      const idFieldIsNotNamedId = modelFields.find((field: Field) => {
        return (
          field.name !== "id" &&
          field.attributes?.some((attr) => attr.name === "id")
        );
      });

      if (idFieldIsNotNamedId) {
        builder
          .model(model.name)
          .field(idFieldIsNotNamedId.name)
          .attribute("map", [idFieldIsNotNamedId.name]);
        builder
          .model(model.name)
          .field(idFieldIsNotNamedId.name)
          .then<Field>((field) => {
            field.name = "id";
          });
      }
    });
    return builder;
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
      id: cuid(), // creating here the entity id because we need it for the relation
      name: model.name,
      displayName: modelDisplayName,
      pluralDisplayName: entityPluralDisplayName,
      description: "",
      customAttributes: entityAttributes,
      fields: [],
    };
  }

  private createOneEntityFieldCommonProperties(
    field: Field,
    fieldDataType: EnumDataType
  ): CreateEntityFieldInput {
    const fieldDisplayName = formatDisplayName(field.name);
    const isUniqueField = field.attributes?.some(
      (attr) => attr.name === "unique"
    );

    const fieldAttributes = filterOutAmplicationAttributes(
      this.prepareAttributes(field.attributes)
    ).join(" ");

    return {
      permanentId: cuid(),
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

    const lookupModelType = () => {
      const modelList = schema.list.filter((item) => item.type === "model");
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
    const modelList = schema.list.filter((item) => item.type === "model");
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
      (property) => property.type === "field"
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

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.Boolean
    );

    entity.fields.push(entityField);

    return entity;
  }

  convertPrismaCreatedAtToEntityField(
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

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.CreatedAt
    );

    if (entityField.customAttributes.includes("@default()")) {
      entityField.customAttributes = entityField.customAttributes.replace(
        "@default()",
        ""
      );
    }

    entity.fields.push(entityField);

    return entity;
  }

  convertPrismaUpdatedAtToEntityField(
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

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.UpdatedAt
    );

    if (entityField.customAttributes.includes("@default()")) {
      entityField.customAttributes = entityField.customAttributes.replace(
        "@default()",
        ""
      );
    }

    entity.fields.push(entityField);

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

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.DateTime
    );

    entityField.properties = {
      timeZone: "localTime",
      dateOnly: false,
    };

    entity.fields.push(entityField);

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

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.DecimalNumber
    );

    entityField.properties = {
      minimumValue: 0,
      maximumValue: 99999999999,
      precision: 8,
    };

    entity.fields.push(entityField);

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

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.WholeNumber
    );

    entityField.properties = {
      minimumValue: 0,
      maximumValue: 99999999999,
    };

    entity.fields.push(entityField);

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

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.SingleLineText
    );

    entityField.properties = {
      maxLength: 256,
    };

    entity.fields.push(entityField);

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

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.Json
    );

    entity.fields.push(entityField);

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

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.Id
    );

    if (entityField.customAttributes.includes("@default()")) {
      entityField.customAttributes = entityField.customAttributes.replace(
        "@default()",
        ""
      );
    }

    const defaultIdAttribute = field.attributes?.find(
      (attr) => attr.name === "default"
    );

    if (defaultIdAttribute && defaultIdAttribute.args) {
      const idType = (defaultIdAttribute.args[0].value as Func).name || "cuid";
      entityField.properties = idTypePropertyMap[idType];
    }

    entity.fields.push(entityField);

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

    const entityField = this.createOneEntityFieldCommonProperties(
      field,
      EnumDataType.OptionSet
    );

    const enums = schema.list.filter((item) => item.type === "enum");
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

    entityField.properties = {
      options: enumOptions,
    };

    entity.fields.push(entityField);

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

    const entityField = this.createOneEntityFieldCommonProperties(
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

    entityField.properties = {
      options: enumOptions,
    };

    entity.fields.push(entityField);

    return entity;
  }

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

    const relatedEntity = preparedEntities.find(
      (entity) => entity.name === remoteModel.name
    ) as CreateEntityInput;

    entityField.properties = {
      relatedEntityId: relatedEntity.id,
      allowMultipleSelection: field.array || false,
      fkHolder: null,
    };
    entityField.relatedFieldName = relatedField.name;
    entityField.relatedFieldDisplayName = relatedField.displayName;
    entityField.relatedFieldAllowMultipleSelection = remoteField.array || false;

    entity.fields.push(entityField);
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
        item.type === "model" &&
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
      (property) => property.type === "field"
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

        const isInvalidFkFieldName = this.validateFKFieldName(
          model.name,
          field.name
        );
        if (isInvalidFkFieldName) {
          errors.push(...isInvalidFkFieldName);
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

  validateFKFieldName(
    modelName: string,
    fieldName: string
  ): ErrorMessage[] | null {
    const errors: ErrorMessage[] = [];
    const isValidFkFieldName = isCamelCaseWithIdSuffix(fieldName);

    if (!isValidFkFieldName) {
      errors.push({
        message: ErrorMessages.InvalidFKFieldName,
        level: ErrorLevel.Error,
        details: `Field name: "${fieldName}" in model: "${modelName}" must be in camelCase and end with "Id"`,
      });
    }

    return errors.length > 0 ? errors : null;
  }
}
