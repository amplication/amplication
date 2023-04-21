import { print } from "@amplication/code-gen-utils";
import { builders, namedTypes } from "ast-types";
import {
  NamedClassDeclaration,
  DTOs,
  ModuleMap,
} from "@amplication/code-gen-types";
import { createDTOFile } from "../server/resource/dto/create-dto-module";
import { getNamedProperties } from "../utils/ast";

export function createDTOModules(
  dtos: DTOs,
  dtoNameToPath: Record<string, string>
): ModuleMap {
  const modules = new ModuleMap();

  const serverDtos = Object.values(dtos).flatMap((entityDTOs) =>
    Object.values(entityDTOs)
  );

  for (const serverDTO of serverDtos) {
    const dto = transformServerDTOToClientDTO(serverDTO);
    const modulePath = dtoNameToPath[dto.id.name];
    const file = createDTOFile(dto, modulePath, dtoNameToPath);
    modules.set(modulePath, {
      path: modulePath,
      code: print(file).code,
    });
  }

  return modules;
}

function transformServerDTOToClientDTO(
  entityDTOs: NamedClassDeclaration | namedTypes.TSEnumDeclaration
): namedTypes.TSTypeAliasDeclaration | namedTypes.TSEnumDeclaration {
  if (namedTypes.TSEnumDeclaration.check(entityDTOs)) {
    return entityDTOs;
  }
  const dtoProperties = getNamedProperties(entityDTOs);
  return builders.tsTypeAliasDeclaration(
    entityDTOs.id,
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
