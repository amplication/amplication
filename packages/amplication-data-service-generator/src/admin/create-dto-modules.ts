import { print } from "recast";
import { builders, namedTypes } from "ast-types";
import { Module } from "../types";
import { DTOs } from "../server/resource/create-dtos";
import { createDTOFile } from "../server/resource/dto/create-dto-module";
import { getNamedProperties, NamedClassDeclaration } from "../util/ast";

export function createDTOModules(
  dtos: DTOs,
  dtoNameToPath: Record<string, string>
): Module[] {
  return Object.values(dtos).flatMap((entityDTOs) =>
    Object.values(entityDTOs).map((serverDTO) => {
      const dto = transformServerDTOToClientDTO(serverDTO);
      const modulePath = dtoNameToPath[dto.id.name];
      const file = createDTOFile(dto, modulePath, dtoNameToPath);
      return {
        path: modulePath,
        code: print(file).code,
      };
    })
  );
}

function transformServerDTOToClientDTO(
  serverDTO: NamedClassDeclaration | namedTypes.TSEnumDeclaration
): namedTypes.TSTypeAliasDeclaration | namedTypes.TSEnumDeclaration {
  if (namedTypes.TSEnumDeclaration.check(serverDTO)) {
    return serverDTO;
  }
  const dtoProperties = getNamedProperties(serverDTO);
  return builders.tsTypeAliasDeclaration(
    serverDTO.id,
    builders.tsTypeLiteral(
      dtoProperties.map((property) => {
        return builders.tsPropertySignature(
          builders.identifier(property.key.name),
          property.typeAnnotation,
          Boolean(property.optional)
        );
      })
    )
  );
}
