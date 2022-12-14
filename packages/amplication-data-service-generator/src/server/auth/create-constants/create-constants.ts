import { Module } from "../../..";
import DsgContext from "../../../dsg-context";
import { types } from "@amplication/code-gen-types";
import { readFile } from "@amplication/code-gen-utils";
import { interpolate, removeTSClassDeclares } from "../../../util/ast";
import { builders } from "ast-types";
import { print } from "recast";
import { getUserIdType } from "../../../util/get-user-id-type";

const templatePath = require.resolve("./create-constants.template.ts");

export async function createAuthConstants(): Promise<Module> {
  const { serverDirectories } = DsgContext.getInstance;
  const serverAuthTestDir = `${serverDirectories.srcDirectory}/tests/auth`;
  const template = await readFile(templatePath);
  const templateMapping = prepareTemplateMapping();
  const filePath = `${serverAuthTestDir}/constants.ts`;
  interpolate(template, templateMapping);
  removeTSClassDeclares(template);

  return { code: print(template).code, path: filePath };
}

function prepareTemplateMapping() {
  const idType = getUserIdType();

  /* eslint-disable @typescript-eslint/naming-convention */
  const idTypeTSOptions: {
    [key in types.Id["idType"]]: any;
  } = {
    AUTO_INCREMENT: builders.numericLiteral(1),
    UUID: builders.stringLiteral("cl7qmjh4h0000tothyjqapgj5"),
    CUID: builders.stringLiteral("cl7qmjh4h0000tothyjqapgj5"),
  };

  return { ID_TYPE: idTypeTSOptions[idType] };
}
