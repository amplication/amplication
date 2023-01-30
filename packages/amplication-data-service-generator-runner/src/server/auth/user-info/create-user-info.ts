import DsgContext from "../../../dsg-context";
import {
  CreateUserInfoParams,
  EventNames,
  Module,
  types,
} from "@amplication/code-gen-types";
import { readFile, print } from "@amplication/code-gen-utils";
import { interpolate, removeTSClassDeclares } from "../../../utils/ast";
import { builders, namedTypes } from "ast-types";

import { getEntityIdType } from "../../../utils/get-entity-id-type";
import pluginWrapper from "../../../plugin-wrapper";

const templatePath = require.resolve("./user-info.template.ts");

export async function createUserInfo(): Promise<Module[]> {
  const { serverDirectories, userEntityName } = DsgContext.getInstance;
  const authDir = `${serverDirectories.srcDirectory}/auth`;
  const template = await readFile(templatePath);
  const templateMapping = prepareTemplateMapping(userEntityName);
  const filePath = `${authDir}/UserInfo.ts`;
  return pluginWrapper(createUserInfoInternal, EventNames.CreateUserInfo, {
    template,
    templateMapping,
    filePath,
  });
}

async function createUserInfoInternal({
  template,
  templateMapping,
  filePath,
}: CreateUserInfoParams): Promise<Module[]> {
  interpolate(template, templateMapping);
  removeTSClassDeclares(template);

  return [{ code: print(template).code, path: filePath }];
}

function prepareTemplateMapping(entityName: string) {
  const idType = getEntityIdType(entityName);

  const number = {
    class: "Number",
    type: "number",
  };

  const string = {
    class: "String",
    type: "string",
  };

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

  return {
    USER_ID_TYPE_ANNOTATION: idTypeTSOptions[idType],
    USER_ID_CLASS: idTypClassOptions[idType],
  };
}
