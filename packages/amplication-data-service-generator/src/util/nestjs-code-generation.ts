import { builders, namedTypes } from "ast-types";
import { findConstructor } from "./ast";

export function addInjectableDependency(
  classDeclaration: namedTypes.ClassDeclaration,
  name: string,
  typeId: namedTypes.Identifier
): void {
  const constructor = findConstructor(classDeclaration);

  if (!constructor) {
    throw new Error("Could not find given class declaration constructor");
  }

  constructor.params.push(
    builders.tsParameterProperty.from({
      accessibility: "private",
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
