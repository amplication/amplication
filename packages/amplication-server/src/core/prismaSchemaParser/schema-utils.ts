import {
  Field,
  KeyValue,
  Model,
  RelationArray,
  AttributeArgument,
  BlockAttribute,
  Attribute,
  Schema,
  Func,
  Enum,
  Enumerator,
  ConcretePrismaSchemaBuilder,
} from "@mrleebo/prisma-ast";
import {
  ARG_KEY_FIELD_NAME,
  RELATION_ATTRIBUTE_NAME,
  ARRAY_ARG_TYPE_NAME,
  KEY_VALUE_ARG_TYPE_NAME,
  UNIQUE_ATTRIBUTE_NAME,
  MODEL_TYPE_NAME,
  FIELD_TYPE_NAME,
  ATTRIBUTE_TYPE_NAME,
  MAP_ATTRIBUTE_NAME,
  ENUMERATOR_TYPE_NAME,
  OBJECT_KIND_NAME,
  FUNCTION_ARG_TYPE_NAME,
  ID_FIELD_NAME,
  ID_ATTRIBUTE_NAME,
  DEFAULT_ATTRIBUTE_NAME,
  prismaIdTypeToDefaultIdType,
  ID_DEFAULT_VALUE_CUID_FUNCTION,
} from "./constants";
import {
  filterOutAmplicationAttributes,
  findOriginalModelName,
  formatDisplayName,
  formatModelName,
  lookupField,
} from "./helpers";
import { ExistingEntitySelect, Mapper } from "./types";
import { CreateBulkFieldsInput } from "../entity/entity.service";
import { EnumDataType } from "../../enums/EnumDataType";
import { EnumActionLogLevel } from "../action/dto";
import { ActionContext } from "../userAction/types";
import cuid from "cuid";
import { camelCase } from "lodash";

/**
 * create the common properties of one entity field from model field
 * @param field the current field to prepare
 * @param fieldDataType the field data type
 * @returns the field in a structure of CreateBulkFieldsInput
 */
export function createOneEntityFieldCommonProperties(
  field: Field,
  fieldDataType: EnumDataType
): CreateBulkFieldsInput {
  const fieldDisplayName = formatDisplayName(field.name);
  const isUniqueField =
    field.attributes?.some((attr) => attr.name === UNIQUE_ATTRIBUTE_NAME) ??
    false;

  const fieldAttributes = filterOutAmplicationAttributes(
    prepareFieldAttributes(field.attributes)
  )
    // in some case we get "@default()" (without any value) as an attribute, we want to filter it out
    .filter((attr) => attr !== "@default()")
    .join(" ");

  return {
    permanentId: cuid(),
    name: field.name,
    displayName: fieldDisplayName,
    dataType: fieldDataType,
    required: !field.optional || false,
    unique: isUniqueField,
    searchable: true,
    description: "",
    properties: {},
    customAttributes: fieldAttributes,
  };
}

/******************************************************************************************
 * type guards to check if the argument is a keyvalue argument / relation array / function
 ******************************************************************************************/
function isKeyValue(argValue: any): argValue is KeyValue {
  return argValue && argValue.type === KEY_VALUE_ARG_TYPE_NAME;
}

function isRelationArray(argValue: any): argValue is RelationArray {
  return argValue && argValue.type === ARRAY_ARG_TYPE_NAME;
}

function isFunction(argValue: any): argValue is Func {
  return argValue && argValue.type === FUNCTION_ARG_TYPE_NAME;
}

/**
 * Take the model attributes from the schema object and translate it to array of strings with the "@@" prefix
 * @param attributes the attributes to prepare and convert from the AST form to array of strings
 * @returns array of strings representing the attributes
 */
export function prepareModelAttributes(attributes: BlockAttribute[]): string[] {
  const modelAttrPrefix = "@@";
  if (!attributes || !attributes.length) {
    return [];
  }

  return attributes.map((attribute: BlockAttribute) => {
    const attributeGroup = attribute.group;
    let args = [];
    if (attribute.args && attribute.args.length) {
      args = attribute.args.map((arg: AttributeArgument) => {
        if (isKeyValue(arg.value)) {
          if (isRelationArray(arg.value.value)) {
            return `${arg.value.key}: [${arg.value.value.args.join(", ")}]`;
          } else {
            return `${arg.value.key}: ${arg.value.value}`;
          }
        } else if (isRelationArray(arg.value)) {
          // this if block is for the case that the model attribute contains a function argument like with
          // range index: @@index([value_1(ops: Int4BloomOps)], type: Brin)
          // the usage of "as unknown" is because the library doesn't seem to have a support for this case,
          // it is just knows how to translate the schema to an object, but the types are wrong or missing
          if (
            arg.value.args[0] &&
            (arg.value.args[0] as unknown as Func).type ===
              FUNCTION_ARG_TYPE_NAME
          ) {
            const func = arg.value.args[0] as unknown as Func;
            const funcParams = (func.params as unknown as KeyValue[])
              .map((param) => `${param.key}: ${param.value}`)
              .join(", ");
            return `[${func.name}(${funcParams})]`;
          } else {
            return `[${arg.value.args.join(", ")}]`;
          }
        } else if (isFunction(arg.value)) {
          return arg.value.name;
        } else if (typeof arg.value === "string") {
          return arg.value;
        } else {
          return `"${arg}"`;
        }
      });
    }

    if (attributeGroup) {
      return `${modelAttrPrefix}${attributeGroup}.${attribute.name}(${args.join(
        ", "
      )})`;
    } else {
      return `${modelAttrPrefix}${attribute.name}(${args.join(", ")})`;
    }
  });
}

/**
 * Take the field attributes from the schema object and translate it to array of strings with the "@" prefix
 * @param attributes the attributes to prepare and convert from the AST form to array of strings
 * @returns array of strings representing the attributes
 */
export function prepareFieldAttributes(attributes: Attribute[]): string[] {
  const fieldAttrPrefix = "@";
  if (!attributes || !attributes.length) {
    return [];
  }

  return attributes.map((attribute: Attribute) => {
    const attributeGroup = attribute.group;
    let args = [];
    if (attribute.args && attribute.args.length) {
      args = attribute.args.map((arg: AttributeArgument) => {
        if (isKeyValue(arg.value)) {
          if (isRelationArray(arg.value.value)) {
            return `${arg.value.key}: [${arg.value.value.args.join(", ")}]`;
          } else if (isFunction(arg.value.value)) {
            const functionArgs =
              arg.value.value.params && arg.value.value.params.length
                ? arg.value.value.params.join(", ")
                : "";
            return `${arg.value.key}: ${arg.value.value.name}(${functionArgs})`;
          } else {
            return `${arg.value.key}: ${arg.value.value}`;
          }
        } else if (isFunction(arg.value)) {
          const functionArgs =
            arg.value.params && arg.value.params.length
              ? arg.value.params.join(", ")
              : "";
          return `${arg.value.name}(${functionArgs})`;
        } else if (typeof arg.value === "string") {
          return arg.value;
        } else {
          return `"${arg}"`;
        }
      });
    }

    // if there's an attribute group and args are present
    if (attributeGroup && args.length > 0) {
      return `${fieldAttrPrefix}${attributeGroup}.${attribute.name}(${args.join(
        ", "
      )})`;
    }
    // if there's an attribute group but no args are present
    else if (attributeGroup) {
      return `${fieldAttrPrefix}${attributeGroup}.${attribute.name}`;
    }
    // if there's no attribute group but args are present
    else if (args.length > 0) {
      return `${fieldAttrPrefix}${attribute.name}(${args.join(", ")})`;
    }
    // if no args are present (@id, @unique)
    else {
      return `${fieldAttrPrefix}${attribute.name}`;
    }
  });
}

export function findRelationAttributeName(
  relationAttribute: Attribute
): string | undefined {
  if (!relationAttribute.args) {
    throw new Error(
      `Missing args attribute on relation attribute on field ${relationAttribute.name}`
    );
  }

  const keyRelationAttributeName = (
    relationAttribute.args.find(
      (arg) => (arg.value as KeyValue)?.key === "name"
    )?.value as KeyValue
  )?.value as string;

  const valueRelationAttributeName = relationAttribute.args.find(
    (arg) => typeof arg.value === "string"
  )?.value as string;

  return valueRelationAttributeName || keyRelationAttributeName;
}

/**
 * Find the related field in the remote model and return it
 * @param schema the whole processed schema
 * @param model the current model we are working on
 * @param field the current field we are working on
 */
export function findRemoteRelatedModelAndField(
  schema: Schema,
  model: Model,
  field: Field
): { remoteModel: Model; remoteField: Field } | undefined {
  let relationAttributeName: string | undefined;
  let remoteField: Field | undefined;

  const relationAttribute = field.attributes?.find(
    (attr) => attr.name === RELATION_ATTRIBUTE_NAME
  );

  if (relationAttribute) {
    // in the main relation, check if the relation annotation has a name
    relationAttributeName = findRelationAttributeName(relationAttribute);
  }

  const remoteModel = schema.list.find(
    (item) =>
      item.type === MODEL_TYPE_NAME &&
      formatModelName(item.name) === formatModelName(field.fieldType as string)
  ) as Model;

  if (!remoteModel) {
    throw new Error(
      `Model ${field.fieldType} not found in the schema. Please check your schema.prisma file`
    );
  }

  const remoteModelFields = remoteModel.properties.filter(
    (property) => property.type === FIELD_TYPE_NAME
  ) as Field[];

  if (relationAttributeName) {
    // find the remote field in the remote model that has the relation attribute with the name we found
    // and make sure that the field is not the current field because we don't want to return the current field
    // in cases where the relation is self relation
    remoteField = remoteModelFields.find((fieldOnRelatedModel: Field) => {
      return (
        field.name !== fieldOnRelatedModel.name &&
        fieldOnRelatedModel.attributes?.find(
          (attr) =>
            attr.name === RELATION_ATTRIBUTE_NAME &&
            findRelationAttributeName(attr) === relationAttributeName
        )
      );
    });
  } else {
    // in this block the current field is a relation field that doesn't have a relation attribute with name
    // but, because there could be more than one field in the remote model that reference the current model
    // we still need to find the field that reference the current model and *doesn't* have a relation attribute with name
    // it can still have a relation attribute *without* a name (for one to one relation for example) and this case is still valid,
    // meaning it can be the remote field we are looking for
    const remoteRelatedFields = remoteModelFields.filter(
      (fieldOnRelatedModel: Field) =>
        formatModelName(fieldOnRelatedModel.fieldType as string) ===
        formatModelName(model.name)
    );

    remoteField = remoteRelatedFields.find((fieldOnRelatedModel: Field) => {
      const relationAttribute = fieldOnRelatedModel.attributes?.find(
        (attr) => attr.name === RELATION_ATTRIBUTE_NAME
      );
      if (
        !relationAttribute ||
        (relationAttribute && !findRelationAttributeName(relationAttribute))
      ) {
        return fieldOnRelatedModel;
      }
    });
  }

  if (!remoteField) {
    throw new Error(
      `No field found in model ${remoteModel.name} that reference ${model.name}`
    );
  }

  return { remoteModel, remoteField };
}

export function findFkFieldNameOnAnnotatedField(field: Field): string {
  const relationAttribute = field.attributes?.find(
    (attr) => attr.name === RELATION_ATTRIBUTE_NAME
  );

  const fieldsArgs = relationAttribute?.args?.find(
    (arg) =>
      (arg.value as KeyValue).key &&
      (arg.value as KeyValue).key === ARG_KEY_FIELD_NAME
  );

  if (!fieldsArgs) {
    throw new Error(
      `Missing fields attribute on relation attribute on field ${field.name}`
    );
  }

  const fieldsArgsValues = (
    (fieldsArgs.value as KeyValue).value as RelationArray
  ).args;

  if (fieldsArgsValues.length > 1) {
    throw new Error(
      `Relation attribute on field ${field.name} has more than one field, which is not supported`
    );
  }

  return fieldsArgsValues[0];
}

export function handleModelNamesCollision(
  modelList: Model[],
  existingEntities: ExistingEntitySelect[],
  mapper: Mapper,
  formattedModelName: string
): string {
  const modelSuffix = "Model";
  let isFormattedModelNameAlreadyTaken = false;
  let newName = formattedModelName;
  let counter = 0;

  do {
    isFormattedModelNameAlreadyTaken = modelList.some(
      (modelFromList) => modelFromList.name === newName
    );

    isFormattedModelNameAlreadyTaken ||= existingEntities.some(
      (existingEntity) => existingEntity.name === newName
    );

    isFormattedModelNameAlreadyTaken ||= Object.values(mapper.modelNames).some(
      (model) => model.newName === newName
    );

    if (isFormattedModelNameAlreadyTaken) {
      newName = `${formattedModelName}${modelSuffix}${counter ? counter : ""}`;
      counter++;
    }
  } while (isFormattedModelNameAlreadyTaken);

  return newName;
}

export function handleEnumMapAttribute(
  enumOfTheField: Enum,
  actionContext: ActionContext
): { label: string; value: string }[] {
  const enumOptions = [];
  const enumerators = enumOfTheField.enumerators as Enumerator[];
  let optionSetObj;

  for (let i = 0; i < enumerators.length; i++) {
    // if the current item is a map attribute on the enum, skip it and don't add it to the enumOptions array
    if (
      (enumerators[i] as unknown as BlockAttribute).type ===
        ATTRIBUTE_TYPE_NAME &&
      (enumerators[i] as unknown as BlockAttribute).kind === OBJECT_KIND_NAME &&
      enumerators[i].name === MAP_ATTRIBUTE_NAME
    ) {
      void actionContext.onEmitUserActionLog(
        `The enum '${enumOfTheField.name}' has been created, but it has not been mapped. Mapping an enum name is not supported.`,
        EnumActionLogLevel.Warning
      );
      continue;
    }

    // if the current item is a map attribute on the key of the enum, skip it and don't add it to the enumOptions array
    if (
      (enumerators[i] as unknown as Attribute).type === ATTRIBUTE_TYPE_NAME &&
      (enumerators[i] as unknown as Attribute).kind === FIELD_TYPE_NAME &&
      enumerators[i].name === MAP_ATTRIBUTE_NAME
    ) {
      continue;
    }

    // if the current item is an enumerator and the next item is exists and it is a map attribute, add the enumerator to the enumOptions array
    if (
      enumerators[i].type === ENUMERATOR_TYPE_NAME &&
      enumerators[i + 1] &&
      (enumerators[i + 1] as unknown as Attribute).type ===
        ATTRIBUTE_TYPE_NAME &&
      (enumerators[i + 1] as unknown as Attribute).kind === FIELD_TYPE_NAME &&
      enumerators[i + 1].name === MAP_ATTRIBUTE_NAME
    ) {
      optionSetObj = {
        label: enumerators[i].name,
        value: enumerators[i].name,
      };

      void actionContext.onEmitUserActionLog(
        `The option '${enumerators[i].name}' has been created in the enum '${enumOfTheField.name}', but its value has not been mapped`,
        EnumActionLogLevel.Warning
      );

      enumOptions.push(optionSetObj);
      // the regular case, when the current item is an enumerator and the next item is not a map attribute
    } else if (enumerators[i].type === ENUMERATOR_TYPE_NAME) {
      optionSetObj = {
        label: enumerators[i].name,
        value: enumerators[i].name,
      };

      void actionContext.onEmitUserActionLog(
        `The option '${enumerators[i].name}' has been created in the enum '${enumOfTheField.name}'`,
        EnumActionLogLevel.Info
      );

      enumOptions.push(optionSetObj);
    }
  }
  return enumOptions;
}

export function addIdFieldIfNotExists(
  builder: ConcretePrismaSchemaBuilder,
  model: Model,
  actionContext: ActionContext
) {
  builder
    .model(model.name)
    .field(ID_FIELD_NAME, "String")
    .attribute(ID_ATTRIBUTE_NAME)
    .attribute(DEFAULT_ATTRIBUTE_NAME, [ID_DEFAULT_VALUE_CUID_FUNCTION]);

  void actionContext.onEmitUserActionLog(
    `id field was added to model "${model.name}"`,
    EnumActionLogLevel.Warning
  );
}

export function convertUniqueFieldNamedIdToIdField(
  builder: ConcretePrismaSchemaBuilder,
  model: Model,
  uniqueFieldNamedId: Field,
  actionContext: ActionContext
) {
  const idDefaultType: string =
    prismaIdTypeToDefaultIdType[uniqueFieldNamedId.fieldType as string];

  builder
    .model(model.name)
    .field(uniqueFieldNamedId.name)
    .attribute(ID_ATTRIBUTE_NAME)
    .attribute(DEFAULT_ATTRIBUTE_NAME, [idDefaultType]);

  void actionContext.onEmitUserActionLog(
    `attribute "@id" was added to the field "${uniqueFieldNamedId.name}" on model "${model.name}"`,
    EnumActionLogLevel.Info
  );
}

export function convertUniqueFieldNotNamedIdToIdField(
  builder: ConcretePrismaSchemaBuilder,
  schema: Schema,
  model: Model,
  uniqueFieldAsIdField: Field,
  mapper: Mapper,
  actionContext: ActionContext
) {
  const originalModelName = findOriginalModelName(mapper, model.name);

  addMapAttributeToField(
    builder,
    schema,
    model,
    uniqueFieldAsIdField,
    actionContext
  );

  const idDefaultType =
    prismaIdTypeToDefaultIdType[uniqueFieldAsIdField.fieldType as string];

  builder
    .model(model.name)
    .field(uniqueFieldAsIdField.name)
    .attribute(ID_ATTRIBUTE_NAME)
    .attribute(DEFAULT_ATTRIBUTE_NAME, [idDefaultType]);

  void actionContext.onEmitUserActionLog(
    `attribute "@id" was added to the field "${uniqueFieldAsIdField.name}" on model "${model.name}"`,
    EnumActionLogLevel.Info
  );

  mapper.idFields = {
    ...mapper.idFields,
    [originalModelName]: {
      ...mapper.idFields[originalModelName],
      [uniqueFieldAsIdField.name]: {
        originalName: uniqueFieldAsIdField.name,
        newName: ID_FIELD_NAME,
      },
    },
  };

  void actionContext.onEmitUserActionLog(
    `field ${uniqueFieldAsIdField.name} was renamed to ${ID_FIELD_NAME}`,
    EnumActionLogLevel.Info
  );

  builder
    .model(model.name)
    .field(uniqueFieldAsIdField.name)
    .then<Field>((field) => {
      field.name = ID_FIELD_NAME;
    });
}

export function handleIdFieldNotNamedId(
  builder: ConcretePrismaSchemaBuilder,
  schema: Schema,
  model: Model,
  field: Field,
  mapper: Mapper,
  actionContext: ActionContext
) {
  const originalModelName = findOriginalModelName(mapper, model.name);

  void actionContext.onEmitUserActionLog(
    `field name "${field.name}" on model name ${model.name} was changed to "id"`,
    EnumActionLogLevel.Info
  );

  mapper.idFields = {
    ...mapper.idFields,
    [originalModelName]: {
      ...mapper.idFields[originalModelName],
      [field.name]: {
        originalName: field.name,
        newName: ID_FIELD_NAME,
      },
    },
  };

  addMapAttributeToField(builder, schema, model, field, actionContext);

  builder
    .model(model.name)
    .field(field.name)
    .then<Field>((field) => {
      field.name = ID_FIELD_NAME;
    });
}

export function handleNotIdFieldNotUniqueNamedId(
  builder: ConcretePrismaSchemaBuilder,
  schema: Schema,
  model: Model,
  field: Field,
  mapper: Mapper,
  actionContext: ActionContext
) {
  const originalModelName = findOriginalModelName(mapper, model.name);

  void actionContext.onEmitUserActionLog(
    `field name "${field.name}" on model name ${model.name} was changed to "${model.name}Id"`,
    EnumActionLogLevel.Info
  );

  mapper.idFields = {
    ...mapper.idFields,
    [originalModelName]: {
      ...mapper.idFields[originalModelName],
      [field.name]: {
        originalName: field.name,
        newName: `${model.name}Id`,
      },
    },
  };

  addMapAttributeToField(builder, schema, model, field, actionContext);

  builder
    .model(model.name)
    .field(field.name)
    .then<Field>((field) => {
      field.name = `${camelCase(model.name)}Id`;
    });
}

// add map attribute to model if the model was formatted and if the map attribute is not already exists
export function addMapAttributeToModel(
  builder: ConcretePrismaSchemaBuilder,
  model: Model,
  actionContext: ActionContext
) {
  const modelAttributes = model.properties.filter(
    (prop) =>
      prop.type === ATTRIBUTE_TYPE_NAME && prop.kind === OBJECT_KIND_NAME
  ) as BlockAttribute[];

  const hasMapAttribute = modelAttributes?.some(
    (attribute) => attribute.name === MAP_ATTRIBUTE_NAME
  );

  if (!hasMapAttribute) {
    builder.model(model.name).blockAttribute(MAP_ATTRIBUTE_NAME, model.name);

    void actionContext.onEmitUserActionLog(
      `attribute "@@map" was added to the model "${model.name}"`,
      EnumActionLogLevel.Info
    );
  }
}

// add map attribute to field if the field was formatted and if the map attribute is not already exists and if the field is not a lookup field
export function addMapAttributeToField(
  builder: ConcretePrismaSchemaBuilder,
  schema: Schema,
  model: Model,
  field: Field,
  actionContext: ActionContext
) {
  const fieldAttributes = field.attributes?.filter(
    (attr) => attr.type === ATTRIBUTE_TYPE_NAME
  ) as Attribute[];

  const hasMapAttribute = fieldAttributes?.find(
    (attribute: Attribute) => attribute.name === MAP_ATTRIBUTE_NAME
  );

  const shouldAddMapAttribute = !hasMapAttribute && !lookupField(schema, field);

  if (shouldAddMapAttribute) {
    builder
      .model(model.name)
      .field(field.name)
      .attribute(MAP_ATTRIBUTE_NAME, [`"${field.name}"`]);

    void actionContext.onEmitUserActionLog(
      `attribute "@map" was added to the field "${field.name}" on model "${model.name}"`,
      EnumActionLogLevel.Info
    );
  }
}
