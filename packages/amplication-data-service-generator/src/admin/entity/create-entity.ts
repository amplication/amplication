import * as path from "path";
import { print } from "recast";
import { builders } from "ast-types";
import { Entity } from "../../types";
import { interpolate, removeTSVariableDeclares } from "../../util/ast";
import { Module, readFile } from "../../util/module";

const entityListTemplate = path.resolve(__dirname, "entity-list.template.tsx");

export async function createEntity(entity: Entity): Promise<Module> {
  const file = await readFile(entityListTemplate);
  const listComponentName = `${entity.name}List`;
  interpolate(file, {
    ENTITY_LIST: builders.identifier(listComponentName),
    ENTITY_NAME: builders.stringLiteral(listComponentName),
  });
  removeTSVariableDeclares(file);
  return {
    path: `admin/src/${listComponentName}.tsx`,
    code: print(file).code,
  };
}
