import { Module } from "../../..";
import DsgContext from "../../../dsg-context";
import { types } from "@amplication/code-gen-types";
import { readFile } from "../../../util/module";
import { interpolate, removeTSClassDeclares } from "../../../util/ast";
import { builders, namedTypes } from "ast-types";
import { print } from "recast";
import { getUserIdType } from "../../../util/get-user-id-type";

export async function createUserInfo(): Promise<Module> {
  const { serverDirectories } = DsgContext.getInstance;
  const authDir = `${serverDirectories.srcDirectory}/auth`;
  const idType = getUserIdType();

  const number = {
    class: "Number",
    type: "number",
  };

  const string = {
    class: "String",
    type: "string",
  };

  /* eslint-disable @typescript-eslint/naming-convention */
  const idTypClassOptions: {
    [key in types.Id["idType"]]: namedTypes.Identifier;
  } = {
    AUTO_INCREMENT: builders.identifier(number.class),
    UUID: builders.identifier(string.class),
    CUID: builders.identifier(string.class),
  };

  /* eslint-disable @typescript-eslint/naming-convention */
  const idTypeTSOptions: {
    [key in types.Id["idType"]]: namedTypes.Identifier;
  } = {
    AUTO_INCREMENT: builders.identifier(number.type),
    UUID: builders.identifier(string.type),
    CUID: builders.identifier(string.type),
  };

  const templatePath = require.resolve("./user-info.template.ts");
  const file = await readFile(templatePath);

  interpolate(file, {
    USER_ID_TYPE_ANNOTATION: idTypeTSOptions[idType],
    USER_ID_CLASS: idTypClassOptions[idType],
  });
  removeTSClassDeclares(file);

  const filePath = `${authDir}/UserInfo.ts`;

  return { code: print(file).code, path: filePath };
}
