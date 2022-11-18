import { Module } from "../../..";
import DsgContext from "../../../dsg-context";
import { EnumDataType } from "../../../models";
import { types } from "@amplication/code-gen-types";
import { readFile } from "../../../util/module";
import { interpolate, removeTSClassDeclares } from "../../../util/ast";
import { builders, namedTypes } from "ast-types";
import { print } from "recast";

export async function createTokenPayload(): Promise<Module> {
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

  const templatePath = require.resolve("./token-payload-interface.template.ts");
  const file = await readFile(templatePath);

  const idTypeTSOptions: { [key: string]: () => namedTypes.Identifier } = {
    AUTO_INCREMENT: () => builders.identifier("number"),
    UUID: () => builders.identifier("string"),
    CUID: () => builders.identifier("string"),
  };

  interpolate(file, {
    ID_TYPE: idTypeTSOptions[idType](),
  });
  removeTSClassDeclares(file);

  const filePath = `${authDir}/ITokenService.ts`;

  return { code: print(file).code, path: filePath };
}
