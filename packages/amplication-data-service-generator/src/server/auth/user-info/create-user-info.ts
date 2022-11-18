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

  let astIdClass: namedTypes.Identifier;
  let astIdType: namedTypes.Identifier;

  switch (idType) {
    case "AUTO_INCREMENT":
      astIdClass = builders.identifier(number.class);
      astIdType = builders.identifier(number.type);
      break;
    case "UUID" || "CUID":
      astIdClass = builders.identifier(string.class);
      astIdType = builders.identifier(string.type);
      break;
    default:
      throw new Error("Invalid id type");
  }

  interpolate(file, {
    USER_ID_TYPE_ANNOTATION: astIdType,
    USER_ID_CLASS: astIdClass,
  });
  removeTSClassDeclares(file);

  const filePath = `${authDir}/UserInfo.ts`;

  return { code: print(file).code, path: filePath };
}
