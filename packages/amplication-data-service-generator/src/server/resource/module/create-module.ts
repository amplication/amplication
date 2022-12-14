import { builders, namedTypes } from "ast-types";
import { print } from "recast";
import {
  EventNames,
  Module,
  CreateEntityModuleParams,
  CreateEntityModuleBaseParams,
} from "@amplication/code-gen-types";
import { relativeImportPath } from "../../../util/module";
import { readFile } from "@amplication/code-gen-utils";
import {
  interpolate,
  removeTSIgnoreComments,
  importNames,
  addAutoGenerationComment,
  addImports,
  removeTSClassDeclares,
  removeESLintComments,
} from "../../../util/ast";
import { removeIdentifierFromModuleDecorator } from "../../../util/nestjs-code-generation";
import { createControllerId } from "../controller/create-controller";
import { createServiceId } from "../service/create-service";
import { createResolverId } from "../resolver/create-resolver";
import DsgContext from "../../../dsg-context";
import pluginWrapper from "../../../plugin-wrapper";

const moduleTemplatePath = require.resolve("./module.template.ts");
const moduleBaseTemplatePath = require.resolve("./module.base.template.ts");

export async function createModules(
  entityName: string,
  entityType: string,
  entityServiceModule: string,
  entityControllerModule: string | undefined,
  entityResolverModule: string | undefined
): Promise<Module[]> {
  const moduleBaseId = createBaseModuleId(entityType);

  return [
    ...(await pluginWrapper(createModule, EventNames.CreateEntityModule, {
      entityName,
      entityType,
      entityServiceModule,
      entityControllerModule,
      entityResolverModule,
      moduleBaseId,
    })),
    ...(await pluginWrapper(
      createBaseModule,
      EventNames.CreateEntityModuleBase,
      {
        entityName,
        moduleBaseId,
      }
    )),
  ];
}

async function createModule({
  entityName,
  entityType,
  entityServiceModule,
  entityControllerModule,
  entityResolverModule,
  moduleBaseId,
}: CreateEntityModuleParams): Promise<Module[]> {
  const { serverDirectories } = DsgContext.getInstance;
  const modulePath = `${serverDirectories.srcDirectory}/${entityName}/${entityName}.module.ts`;
  const moduleBasePath = `${serverDirectories.srcDirectory}/${entityName}/base/${entityName}.module.base.ts`;
  const file = await readFile(moduleTemplatePath);
  const controllerId = createControllerId(entityType);
  const serviceId = createServiceId(entityType);
  const resolverId = createResolverId(entityType);
  const moduleId = createModuleId(entityType);

  interpolate(file, {
    ENTITY: builders.identifier(entityType),
    SERVICE: serviceId,
    CONTROLLER: controllerId,
    RESOLVER: resolverId,
    MODULE: moduleId,
    MODULE_BASE: moduleBaseId,
  });

  const moduleBaseImport = importNames(
    [moduleBaseId],
    relativeImportPath(modulePath, moduleBasePath)
  );

  const serviceImport = importNames(
    [serviceId],
    relativeImportPath(modulePath, entityServiceModule)
  );

  const controllerImport = entityControllerModule
    ? importNames(
        [controllerId],
        relativeImportPath(modulePath, entityControllerModule)
      )
    : undefined;

  // if we are not generating the controller, remove the controller property
  if (!entityControllerModule) {
    removeIdentifierFromModuleDecorator(file, controllerId);
  }

  const resolverImport = entityResolverModule
    ? importNames(
        [resolverId],
        relativeImportPath(modulePath, entityResolverModule)
      )
    : undefined;

  //if we are not generating the resolver, remove it from the providers list
  if (!entityResolverModule) {
    removeIdentifierFromModuleDecorator(file, resolverId);
  }

  addImports(
    file,
    [moduleBaseImport, serviceImport, controllerImport, resolverImport].filter(
      (x) => x //remove nulls and undefined
    ) as namedTypes.ImportDeclaration[]
  );

  removeTSIgnoreComments(file);
  removeESLintComments(file);
  removeTSClassDeclares(file);

  return [
    {
      path: modulePath,
      code: print(file).code,
    },
  ];
}

async function createBaseModule({
  entityName,
  moduleBaseId,
}: CreateEntityModuleBaseParams): Promise<Module[]> {
  const { serverDirectories } = DsgContext.getInstance;
  const modulePath = `${serverDirectories.srcDirectory}/${entityName}/base/${entityName}.module.base.ts`;
  const file = await readFile(moduleBaseTemplatePath);

  interpolate(file, {
    MODULE_BASE: moduleBaseId,
  });

  removeTSIgnoreComments(file);
  removeESLintComments(file);
  removeTSClassDeclares(file);
  addAutoGenerationComment(file);

  return [
    {
      path: modulePath,
      code: print(file).code,
    },
  ];
}

function createModuleId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`${entityType}Module`);
}

function createBaseModuleId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`${entityType}ModuleBase`);
}
