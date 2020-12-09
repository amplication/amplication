import * as path from "path";
import { builders } from "ast-types";
import { Entity } from "../../../types";
import { addImports, importDeclaration, interpolate } from "../../../util/ast";
import { EntityComponent } from "../../types";
import { readFile, relativeImportPath } from "../../../util/module";

const template = path.resolve(__dirname, "entity-index-component.template.tsx");

export async function createEntityIndexComponent(
  entity: Entity,
  entityToDirectory: Record<string, string>,
  entityToPath: Record<string, string>,
  entityListComponent: EntityComponent,
  newEntityComponent: EntityComponent,
  entityComponent: EntityComponent
): Promise<EntityComponent> {
  const name = `${entity.name}Index`;
  const modulePath = `${entityToDirectory[entity.name]}/${name}.tsx`;

  const file = await readFile(template);

  interpolate(file, {
    COMPONENT_NAME: builders.identifier(name),
    ENTITY_PATH: builders.stringLiteral(entityToPath[entity.name]),
    ENTITY_LIST_COMPONENT: builders.identifier(entityListComponent.name),
    NEW_ENTITY_COMPONENT: builders.identifier(newEntityComponent.name),
    ENTITY_COMPONENT: builders.identifier(entityComponent.name),
  });

  addImports(file, [
    importDeclaration`import {${
      entityListComponent.name
    }} from "${relativeImportPath(
      modulePath,
      entityListComponent.modulePath
    )}"`,
    importDeclaration`import {${
      newEntityComponent.name
    }} from "${relativeImportPath(modulePath, newEntityComponent.modulePath)}"`,
    importDeclaration`import {${
      entityComponent.name
    }} from "${relativeImportPath(modulePath, entityComponent.modulePath)}"`,
  ]);

  return { name, file, modulePath };
}
