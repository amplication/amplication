import { Module } from "../../..";
import DsgContext from "../../../dsg-context";
import { EnumDataType } from "../../../models";
import { types } from "@amplication/code-gen-types";
import { readFile } from "../../../util/module";
import { interpolate, removeTSClassDeclares } from "../../../util/ast";
import { builders, namedTypes } from "ast-types";
import { print } from "recast";
import { USER_ENTITY_NAME } from "../../user-entity";

export async function createUserInfo(): Promise<Module> {
  const { entities, serverDirectories } = DsgContext.getInstance;
  const authDir = `${serverDirectories.srcDirectory}/auth`;
  const userEntity = entities.find(
    (entity) => entity.name === USER_ENTITY_NAME
  );

  if (!userEntity) {
    throw new Error("User entity not found");
  }

  const idField = userEntity.fields.find(
    (field) => field.dataType === EnumDataType.Id
  );
  if (!idField) {
    throw new Error("User entity must have an id field");
  }

  const { idType } = idField.properties as types.Id;

  const number = {
    class: "Number",
    type: "number",
  };

  const string = {
    class: "String",
    type: "string",
  };

  /* eslint-disable @typescript-eslint/naming-convention */
  const idTypClassOptions: { [key: string]: () => namedTypes.Identifier } = {
    AUTO_INCREMENT: () => builders.identifier(number.class),
    UUID: () => builders.identifier(string.class),
    CUID: () => builders.identifier(string.class),
  };

  /* eslint-disable @typescript-eslint/naming-convention */
  const idTypeTSOptions: { [key: string]: () => namedTypes.Identifier } = {
    AUTO_INCREMENT: () => builders.identifier(number.type),
    UUID: () => builders.identifier(string.type),
    CUID: () => builders.identifier(string.type),
  };

  const templatePath = require.resolve("./user-info.template.ts");
  const file = await readFile(templatePath);

  interpolate(file, {
    USER_ID_TYPE_ANNOTATION: idTypeTSOptions[idType](),
    USER_ID_CLASS: idTypClassOptions[idType](),
  });
  removeTSClassDeclares(file);

  const filePath = `${authDir}/UserInfo.ts`;

  return { code: print(file).code, path: filePath };
}
