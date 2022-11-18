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

  const number = {
    class: "Number",
    type: "number",
  };

  const string = {
    class: "String",
    type: "string",
  };

  const idTypeMap = {
    AUTO_INCREMENT: "autoIncrement",
    UUID: "uuid",
    CUID: "cuid",
  };

  const idTypClassOptions: { [key: string]: () => namedTypes.Identifier } = {
    autoIncrement: () => builders.identifier(number.class),
    uuid: () => builders.identifier(string.class),
    cuid: () => builders.identifier(string.class),
  };

  const idTypeTSOptions: { [key: string]: () => namedTypes.Identifier } = {
    autoIncrement: () => builders.identifier(number.type),
    uuid: () => builders.identifier(string.type),
    cuid: () => builders.identifier(string.type),
  };

  const templatePath = require.resolve("./user-info.template.ts");
  const file = await readFile(templatePath);

  interpolate(file, {
    USER_ID_TYPE_ANNOTATION: idTypeTSOptions[idTypeMap[idType]](),
    USER_ID_CLASS: idTypClassOptions[idTypeMap[idType]](),
  });
  removeTSClassDeclares(file);

  const filePath = `${authDir}/UserInfo.ts`;

  return { code: print(file).code, path: filePath };
}
