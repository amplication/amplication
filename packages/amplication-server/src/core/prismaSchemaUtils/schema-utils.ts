import { Field, KeyValue, Model, RelationArray } from "@mrleebo/prisma-ast";
import { ARG_KEY_FIELD_NAME, RELATION_ATTRIBUTE_NAME } from "./constants";
import { ExistingEntitySelect, Mapper } from "./types";

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
