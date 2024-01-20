import {
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
import { createPropTypeFromTypeDefList } from "./create-property-type";
import { createGraphQLFieldDecorator } from "./create-graphql-field-decorator";

export const OBJECT_TYPE_DECORATOR = builders.decorator(
  builders.callExpression(OBJECT_TYPE_ID, [])
);

export function createCustomDtos() {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { moduleActionsAndDtoMap, DTOs } = DsgContext.getInstance;
  const moduleMap = new ModuleMap(DsgContext.getInstance.logger);

  const dtos = Object.entries(moduleActionsAndDtoMap).flatMap(
    ([moduleName, module]) => {
      const { dtos } = module;
      return (
        dtos?.map((dto) => {
          const path = createDTOModulePath(camelCase(moduleName), dto.name);
          return {
            path,
            dto: createDto(dto),
          };
        }) || []
      );
    }
  );

  const dtoNameToPath = getDTONameToPath(DTOs);
  const dtoModules = dtos?.map((dto) => {
    return createDTOModule(dto.dto, dtoNameToPath, dto.path, false);
  });

  dtoModules.forEach((module) => moduleMap.set(module));

  return moduleMap;
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
  const type = createPropTypeFromTypeDefList(property.propertyTypes);
  const tsTypeAnnotationNode = builders.tsTypeAnnotation(type);

  const decorators: namedTypes.Decorator[] = [];

  decorators.push(createGraphQLFieldDecorator(property));

  const classProperty = builders.classProperty(
    builders.identifier(property.name),
    null,
    tsTypeAnnotationNode,
    false
  );

  //@ts-ignore
  classProperty.optional = property.isOptional;

  //@ts-ignore
  classProperty.decorators = decorators;

  return classProperty;
}
