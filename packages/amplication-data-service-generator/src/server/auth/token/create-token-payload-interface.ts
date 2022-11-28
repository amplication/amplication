import { Module } from "../../..";
import DsgContext from "../../../dsg-context";
import { types } from "@amplication/code-gen-types";
import { readFile } from "../../../util/module";
import { interpolate, removeTSClassDeclares } from "../../../util/ast";
import { builders, namedTypes } from "ast-types";
import { print } from "recast";
import { getUserIdType } from "../../../util/get-user-id-type";

export async function createTokenPayload(): Promise<Module> {
  const { serverDirectories } = DsgContext.getInstance;
  const authDir = `${serverDirectories.srcDirectory}/auth`;
  const idType = getUserIdType();

  /* eslint-disable @typescript-eslint/naming-convention */
  const idTypeTSOptions: {
    [key in types.Id["idType"]]: namedTypes.Identifier;
  } = {
    AUTO_INCREMENT: builders.identifier("number"),
    UUID: builders.identifier("string"),
    CUID: builders.identifier("string"),
  };

  const templatePath = require.resolve("./token-payload-interface.template.ts");
  const file = await readFile(templatePath);

  interpolate(file, {
    ID_TYPE: idTypeTSOptions[idType],
  });
  removeTSClassDeclares(file);

  const filePath = `${authDir}/ITokenService.ts`;

  return { code: print(file).code, path: filePath };
}
