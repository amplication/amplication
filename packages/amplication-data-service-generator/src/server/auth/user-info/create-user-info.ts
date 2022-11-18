import { Module } from "../../..";
import DsgContext from "../../../dsg-context";
import { EnumDataType } from "../../../models";
import { types } from "@amplication/code-gen-types";
import { readFile } from "../../../util/module";
import { interpolate, removeTSClassDeclares } from "../../../util/ast";
import { builders, namedTypes } from "ast-types";
import { print } from "recast";

export async function createUserInfo(): Promise<Module> {
  const { entities, serverDirectories } = DsgContext.getInstance;
  const authDir = `${serverDirectories.srcDirectory}/auth`;
  const userEntity = entities.find((e) => e.name === "User");

  if (!userEntity) {
    throw new Error("User entity not found");
  }

  const idField = userEntity.fields.find((f) => f.dataType === EnumDataType.Id);
  if (!idField) {
    throw new Error("User entity must have an id field");
  }

  const { idType } = idField.properties as types.Id;

  const templatePath = require.resolve("./user-info.template.ts");
  const file = await readFile(templatePath);

  const number = {
    class: "Number",
    type: "number",
  };

  const string = {
    class: "String",
    type: "string",
  };

  const idTypClassOptions: { [key: string]: () => namedTypes.Identifier } = {
    AUTO_INCREMENT: () => builders.identifier(number.class),
    UUID: () => builders.identifier(string.class),
    CUID: () => builders.identifier(string.class),
  };

  const idTypeTSOptions: { [key: string]: () => namedTypes.Identifier } = {
    AUTO_INCREMENT: () => builders.identifier(number.type),
    UUID: () => builders.identifier(string.type),
    CUID: () => builders.identifier(string.type),
  };

  interpolate(file, {
    USER_ID_TYPE_ANNOTATION: idTypeTSOptions[idType](),
    USER_ID_CLASS: idTypClassOptions[idType](),
  });
  removeTSClassDeclares(file);

  const filePath = `${authDir}/UserInfo.ts`;

  return { code: print(file).code, path: filePath };
}
