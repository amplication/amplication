/**
 * Utilities for generating Nest.js source code
 */

import { builders, namedTypes } from "ast-types";
import { findConstructor } from "./ast";

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
