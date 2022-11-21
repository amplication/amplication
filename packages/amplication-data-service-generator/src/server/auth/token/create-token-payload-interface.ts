import { Module } from "../../..";
import DsgContext from "../../../dsg-context";
import { EnumDataType } from "../../../models";
import { types } from "@amplication/code-gen-types";
import { readFile } from "../../../util/module";
import { interpolate, removeTSClassDeclares } from "../../../util/ast";
import { builders, namedTypes } from "ast-types";
import { print } from "recast";
import { USER_ENTITY_NAME } from "../../user-entity";

export async function createTokenPayload(): Promise<Module> {
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
