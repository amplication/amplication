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
} from "./constants";
import {
  filterOutAmplicationAttributes,
  formatDisplayName,
  formatModelName,
} from "./helpers";
import { ExistingEntitySelect, Mapper } from "./types";
import { CreateBulkFieldsInput } from "../entity/entity.service";
import { EnumDataType } from "../../enums/EnumDataType";
import { ActionLog, EnumActionLogLevel } from "../action/dto";

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
    // in some case we get "@default()" as an attribute, we want to filter it out
    .filter((attr) => attr !== "@default()")
    .join(" ");

  return {
    name: field.name,
    displayName: fieldDisplayName,
    dataType: fieldDataType,
    required: !field.optional || false,
    unique: isUniqueField,
    searchable: fieldDataType === EnumDataType.Lookup ? true : false,
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
  return argValue && argValue.type === "function";
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
          return `[${arg.value.args.join(", ")}]`;
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
          } else {
            return `${arg.value.key}: ${arg.value.value}`;
          }
        } else if (isFunction(arg.value)) {
          return `${arg.value.name}()`;
        } else if (typeof arg.value === "string") {
          return arg.value;
        } else {
          return `"${arg}"`;
        }
      });
    }

    if (attributeGroup) {
      return `${fieldAttrPrefix}${attributeGroup}.${attribute.name}(${args.join(
        ", "
      )})`;
    } else {
      return `${fieldAttrPrefix}${attribute.name}(${args.join(", ")})`;
    }
  });
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

export function findFkFieldNameOnAnnotatedField(field: Field): string {
  const relationAttribute = field.attributes?.find(
    (attr) => attr.name === RELATION_ATTRIBUTE_NAME
  );

  if (!relationAttribute) {
    throw new Error(`Missing relation attribute on field ${field.name}`);
  }

  const fieldsArgs = relationAttribute.args?.find(
    (arg) => (arg.value as KeyValue).key === ARG_KEY_FIELD_NAME
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

export function handleEnumKyeMapAttribute(
  enumOfTheField: Enum,
  log: ActionLog[]
): { label: string; value: string }[] {
  const enumOptions = [];
  const enumerators = enumOfTheField.enumerators as Enumerator[];
  let optionSetObj;

  for (let i = 0; i < enumerators.length; i++) {
    // if the current item is a map attribute, skip it and don't add it to the enumOptions array
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

      log.push(
        new ActionLog({
          level: EnumActionLogLevel.Warning,
          message: `The option '${enumerators[i].name}' has been created in the enum '${enumOfTheField.name}', but its value has not been mapped`,
        })
      );

      enumOptions.push(optionSetObj);
      // the regular case, when the current item is an enumerator and the next item is not a map attribute
    } else if (enumerators[i].type === ENUMERATOR_TYPE_NAME) {
      optionSetObj = {
        label: enumerators[i].name,
        value: enumerators[i].name,
      };

      log.push(
        new ActionLog({
          level: EnumActionLogLevel.Info,
          message: `The option '${enumerators[i].name}' has been created in the enum '${enumOfTheField.name}'`,
        })
      );

      enumOptions.push(optionSetObj);
    }
  }
  return enumOptions;
}
