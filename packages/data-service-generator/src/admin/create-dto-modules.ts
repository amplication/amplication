import { print } from "@amplication/code-gen-utils";
import { builders, namedTypes } from "ast-types";
import {
  NamedClassDeclaration,
  DTOs,
  ModuleMap,
} from "@amplication/code-gen-types";
import { createDTOFile } from "../server/resource/dto/create-dto-module";
import { getNamedProperties } from "../utils/ast";
import DsgContext from "../dsg-context";

export async function createDTOModules(
  dtos: DTOs,
  dtoNameToPath: Record<string, string>
): Promise<ModuleMap> {
  const moduleMap = new ModuleMap(DsgContext.getInstance.logger);

  const serverDtos = Object.values(dtos).flatMap((entityDTOs) =>
    Object.values(entityDTOs)
  );

  for (const serverDTO of serverDtos) {
    const dto = transformServerDTOToClientDTO(serverDTO);
    const modulePath = dtoNameToPath[dto.id.name];
    const file = createDTOFile(dto, modulePath, dtoNameToPath);
    await moduleMap.set({
      path: modulePath,
      code: print(file).code,
    });
  }

  return moduleMap;
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
