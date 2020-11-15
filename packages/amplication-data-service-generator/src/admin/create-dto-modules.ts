import { print } from "recast";
import { builders, namedTypes } from "ast-types";
import { Module } from "../util/module";
import { DTOs } from "../resource/create-dtos";
import { createDTOFile } from "../resource/dto/create-dto-module";
import { getNamedProperties, NamedClassDeclaration } from "../util/ast";

export function createDTOModules(
  dtos: DTOs,
  dtoNameToPath: Record<string, string>
): Module[] {
  return Object.entries(dtos).flatMap(([entity, entityDTOs]) =>
    Object.values(entityDTOs).map((serverDTO) => {
      const dto = serverDTOToClientDTO(serverDTO);
      const modulePath = dtoNameToPath[dto.id.name];
      const file = createDTOFile(dto, modulePath, dtoNameToPath);
      return {
        path: modulePath,
        code: print(file).code,
      };
    })
  );
}

function serverDTOToClientDTO(
  serverDTO: NamedClassDeclaration | namedTypes.TSEnumDeclaration
): namedTypes.TSTypeAliasDeclaration | namedTypes.TSEnumDeclaration {
  if (namedTypes.TSEnumDeclaration.check(serverDTO)) {
    return serverDTO;
  }
  const dtoProperties = getNamedProperties(serverDTO);
  return builders.tsTypeAliasDeclaration(
    serverDTO.id,
    builders.tsTypeLiteral(
      dtoProperties.map((property) =>
        builders.tsPropertySignature(
          builders.identifier(property.key.name),
          /** @todo explicitly mark typeAnnotation for TypeScript */
          // @ts-ignore
          property.typeAnnotation
        )
      )
    )
  );
}
