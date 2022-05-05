/**
 * Utilities for generating Nest.js source code
 */

import { builders, namedTypes, ASTNode } from "ast-types";
import { findConstructor } from "./ast";
import * as recast from "recast";

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

export function removeIdentifierFromUseInterceptorDecorator(
  node: ASTNode,
  decoratorName: string,
  argToDelete: string /** @todo: change to string[] */
): namedTypes.Decorator | boolean {
  let decorator: namedTypes.ClassDeclaration | null = null;
  recast.visit(node, {
    visitDecorator(path) {
      const callee = path.get("expression", "callee");
      if (callee.value && callee.value.property?.name === decoratorName) {
        decorator = path.value;
        const parentArgs: namedTypes.Identifier[] =
          callee.parentPath.node.arguments;
        const argToDeleteIndex = parentArgs.findIndex(
          (arg) => arg.name === argToDelete
        );
        parentArgs.splice(argToDeleteIndex, 1);
        if (!parentArgs.length) {
          path.prune();
        }
      }
      return this.traverse(path);
    },
    // Recast has a bug of traversing class decorators
    // This method fixes it
    visitClassDeclaration(path) {
      const childPath = path.get("decorators");
      if (childPath.value) {
        this.traverse(childPath);
      }
      return this.traverse(path);
    },
    // Recast has a bug of traversing class property decorators
    // This method fixes it
    visitClassProperty(path) {
      const childPath = path.get("decorators");
      if (childPath.value) {
        this.traverse(childPath);
      }
      this.traverse(path);
    },
  });

  if (!decorator) {
    return false;
  }

  return decorator;
}
