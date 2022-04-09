/**
 * Utilities for generating Nest.js source code
 */

import * as recast from "recast";
import { ASTNode, builders, namedTypes } from "ast-types";
import { findConstructor, findFirstDecoratorByName } from "./ast";

const MODULE_DECORATOR_NAME = "Module";

/**
 * Adds a Nest.js injectable dependency to given classDeclaration
 * @param classDeclaration the injectable class to add dependency to
 * @param name the dependency class member name
 * @param typeId the dependency injectable type identifier
 */
export function addInjectableDependency(
  classDeclaration: namedTypes.ClassDeclaration,
  name: string,
  typeId: namedTypes.Identifier,
  accessibility: "public" | "private" | "protected"
): void {
  const constructor = findConstructor(classDeclaration);

  if (!constructor) {
    throw new Error("Could not find given class declaration constructor");
  }

  constructor.params.push(
    builders.tsParameterProperty.from({
      accessibility: accessibility,
      readonly: true,
      parameter: builders.identifier.from({
        name: name,
        typeAnnotation: builders.tsTypeAnnotation(
          builders.tsTypeReference(typeId)
        ),
      }),
    })
  );
}

/**
 * Removes an identifier from the Module decorator declaration.
 * The function first look for the @Module decorator in the given file
 * Then it looks for the given identifier inside an ArrayExpression and removes it
 * After the removal of the identifier, if the Array is empty, the entire ObjectProperty is removed
 * @param file the file with the AST to remove the identifier from
 */
export function removeIdentifierFromModuleDecorator(
  file: ASTNode,
  identifier: namedTypes.Identifier
): void {
  const moduleDecorator = findFirstDecoratorByName(file, MODULE_DECORATOR_NAME);

  recast.visit(moduleDecorator, {
    visitIdentifier(path) {
      //find the identifier inside and ArrayExpression
      if (
        path.value.name === identifier.name &&
        path.parent.value.type === "ArrayExpression"
      ) {
        const parentPath = path.parent;
        path.prune();
        //If the parent array is left empty, remove the entire ObjectProperty that contained the array
        if (parentPath.value.elements.length === 0) {
          parentPath.parent.prune();
        }
      }
      this.traverse(path);
    },
  });
}
