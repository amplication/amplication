import {
  EnumModuleDtoType,
  ModuleDto,
  ModuleDtoProperty,
  ModuleMap,
  NamedClassDeclaration,
} from "@amplication/code-gen-types";
import { builders, namedTypes } from "ast-types";
import { camelCase } from "lodash";
import DsgContext from "../../../../dsg-context";
import { classDeclaration } from "../../../../utils/ast";
import { getDTONameToPath } from "../../create-dtos";
import { createDTOModule, createDTOModulePath } from "../create-dto-module";
import { OBJECT_TYPE_ID } from "../nestjs-graphql.util";
import { createApiPropertyDecorator } from "./create-api-property-decorator";
import { createGraphQLFieldDecorator } from "./create-graphql-field-decorator";
import { createPropTypeFromTypeDefList } from "./create-property-type";
import { createTypeDecorator } from "./create-type-decorator";

export const OBJECT_TYPE_DECORATOR = builders.decorator(
  builders.callExpression(OBJECT_TYPE_ID, [])
);

type CustomDtoModuleMapWithAllDtoNameToPath = {
  customDtos: ModuleMap;
  dtoNameToPath: Record<string, string>;
};

export function createCustomDtos(): CustomDtoModuleMapWithAllDtoNameToPath {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { moduleActionsAndDtoMap, DTOs } = DsgContext.getInstance;
  const moduleMap = new ModuleMap(DsgContext.getInstance.logger);

  //@todo: refactor to support multiple custom dtos with the same name in different modules
  const customDtoNameToPath: Record<string, string> = {};

  const dtos = Object.entries(moduleActionsAndDtoMap).flatMap(
    ([moduleName, module]) => {
      const { dtos } = module;
      return (
        dtos
          ?.filter((dto) => dto.dtoType === EnumModuleDtoType.Custom)
          .map((dto) => {
            const path = createDTOModulePath(
              camelCase(moduleName),
              dto.name,
              true
            );
            customDtoNameToPath[dto.name] = path;
            return {
              path,
              dto: createDto(dto),
            };
          }) || []
      );
    }
  );

  const dtoNameToPath = getDTONameToPath(DTOs);

  const allDtoNameToPath = { ...dtoNameToPath, ...customDtoNameToPath };

  const dtoModules = dtos?.map((dto) => {
    return createDTOModule(dto.dto, allDtoNameToPath, dto.path, false);
  });

  dtoModules.forEach((module) => moduleMap.set(module));

  return {
    customDtos: moduleMap,
    dtoNameToPath: allDtoNameToPath,
  };
}

export function createDto(dto: ModuleDto): NamedClassDeclaration {
  const dtoProperties = createProperties(dto.properties);

  const dtoClass = classDeclaration(
    builders.identifier(dto.name),
    builders.classBody(dtoProperties),
    null,
    //@todo: replace ObjectType with InputType or ArgsType when needed
    // check whether a DTO is used as ArgsType or ObjectType and whetherGraphQL is enabled
    [OBJECT_TYPE_DECORATOR]
  ) as NamedClassDeclaration;

  return dtoClass;
}

export function createProperties(
  properties: ModuleDtoProperty[]
): namedTypes.ClassProperty[] {
  return properties.map((property) => createProperty(property));
}

export function createProperty(
  property: ModuleDtoProperty
): namedTypes.ClassProperty {
  const { appInfo } = DsgContext.getInstance;

  const type = createPropTypeFromTypeDefList(property.propertyTypes);
  const tsTypeAnnotationNode = builders.tsTypeAnnotation(type);

  const decorators: namedTypes.Decorator[] = [];

  appInfo.settings.serverSettings.generateGraphQL &&
    decorators.push(createGraphQLFieldDecorator(property));

  appInfo.settings.serverSettings.generateRestApi &&
    decorators.push(createApiPropertyDecorator(property));
  decorators.push(createTypeDecorator(property));

  const propId = builders.identifier(property.name);
  const classProperty = builders.classProperty(
    property.isOptional ? propId : builders.tsNonNullExpression(propId),
    null,
    tsTypeAnnotationNode,
    false
  );

  if (property.isOptional) {
    //@ts-ignore - property is missing in ast-types
    classProperty.optional = true;
  } else {
    //this property does not seems to impact the generation ot the "!"" as expected from
    //the code in the recast library, but we keep it here for future reference/ usage
    //the actual fix that adds the "!" runs above by using builders.tsNonNullExpression
    //https://github.com/benjamn/recast/blob/7f441d2c74d2cd61287fc6b498a9060f5597a27c/lib/printer.ts#L1442
    //@ts-ignore - property is missing in ast-types
    classProperty.definite = true;
  }

  //@ts-ignore - property is missing in ast-types
  classProperty.decorators = decorators.filter((decorator) => decorator); //filter null decorators

  return classProperty;
}
