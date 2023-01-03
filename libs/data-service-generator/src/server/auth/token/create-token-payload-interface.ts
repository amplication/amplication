import { Module } from "../../..";
import DsgContext from "../../../dsg-context";
import {
  CreateTokenPayloadInterfaceParams,
  EventNames,
  types,
} from "@amplication/code-gen-types";
import { readFile } from "@amplication/code-gen-utils";
import { interpolate, removeTSClassDeclares } from "../../../util/ast";
import { builders, namedTypes } from "ast-types";
import { print } from "@amplication/code-gen-utils";
import { getEntityIdType } from "../../../util/get-entity-id-type";
import pluginWrapper from "../../../plugin-wrapper";

const templatePath = require.resolve("./token-payload-interface.template.ts");

export async function createTokenPayloadInterface(): Promise<Module[]> {
  const { serverDirectories, userEntityName } = DsgContext.getInstance;
  const authDir = `${serverDirectories.srcDirectory}/auth`;
  const template = await readFile(templatePath);
  const templateMapping = prepareTemplateMapping(userEntityName);
  const filePath = `${authDir}/ITokenService.ts`;
  return pluginWrapper(
    createTokenPayloadInterfaceInternal,
    EventNames.CreateTokenPayloadInterface,
    { template, templateMapping, filePath }
  );
}

async function createTokenPayloadInterfaceInternal({
  template,
  templateMapping,
  filePath,
}: CreateTokenPayloadInterfaceParams): Promise<Module[]> {
  interpolate(template, templateMapping);
  removeTSClassDeclares(template);

  return [{ code: print(template).code, path: filePath }];
}

function prepareTemplateMapping(entityName: string) {
  const idType = getEntityIdType(entityName);

  /* eslint-disable @typescript-eslint/naming-convention */
  const idTypeTSOptions: {
    [key in types.Id["idType"]]: namedTypes.Identifier;
  } = {
    AUTO_INCREMENT: builders.identifier("number"),
    UUID: builders.identifier("string"),
    CUID: builders.identifier("string"),
  };

  return { ID_TYPE: idTypeTSOptions[idType] };
}
