import {
  print,
  readFile,
  removeESLintComments,
  removeTSVariableDeclares,
  removeTSIgnoreComments,
} from "@amplication/code-gen-utils";
import { builders, namedTypes } from "ast-types";
import {
  EventNames,
  Module,
  CreateServerAppModuleParams,
  ModuleMap,
} from "@amplication/code-gen-types";
import { relativeImportPath } from "../../utils/module";

import {
  getExportedNames,
  interpolate,
  importNames,
  addImports,
  importDeclaration,
  callExpression,
} from "../../utils/ast";
import DsgContext from "../../dsg-context";
import pluginWrapper from "../../plugin-wrapper";

const appModuleTemplatePath = require.resolve("./app.module.template.ts");
const MODULE_PATTERN = /\.module\.ts$/;
const PRISMA_MODULE_ID = builders.identifier("PrismaModule");
const MORGAN_MODULE_ID = builders.identifier("MorganModule");
const CONFIG_MODULE_ID = builders.identifier("ConfigModule");
const CONFIG_SERVICE_ID = builders.identifier("ConfigService");
const SERVE_STATIC_MODULE_ID = builders.identifier("ServeStaticModule");
const SERVE_STATIC_OPTIONS_SERVICE_ID = builders.identifier(
  "ServeStaticOptionsService"
);
const GRAPHQL_MODULE_ID = builders.identifier("GraphQLModule");

type CodeGenerationOptions = {
  createGraphQLModule: boolean;
};

export async function createAppModule(
  modulesFiles: ModuleMap
): Promise<ModuleMap> {
  const {
    appInfo: {
      settings: {
        serverSettings: { generateGraphQL },
      },
    },
  } = DsgContext.getInstance;

  const template = await readFile(appModuleTemplatePath);
  const nestModules = modulesFiles
    .modules()
    .filter((module) => module.path.match(MODULE_PATTERN));

  const nestModulesWithExports = nestModules.map((module) => ({
    module,
    exports: getExportedNames(module.code),
  }));

  const nestModulesIds = nestModulesWithExports.flatMap(
    /** @todo explicitly check for "@Module" decorated classes */
    ({ exports }) => exports
  );

  const importModules = [
    ...nestModulesIds,
    MORGAN_MODULE_ID,
    callExpression`${CONFIG_MODULE_ID}.forRoot({ isGlobal: true })`,
    callExpression`${SERVE_STATIC_MODULE_ID}.forRootAsync({
    useClass: ${SERVE_STATIC_OPTIONS_SERVICE_ID}
  })`,
  ];

  const moduleImportsArrayExpression = createModuleImportsArrayExpression(
    importModules,
    {
      createGraphQLModule: generateGraphQL,
    }
  );

  //@TODO: allow some env variable to override the autoSchemaFile: "schema.graphql" (e.g. GQL_SCHEMA_EXPORT_PATH)
  const templateMapping = {
    MODULES: moduleImportsArrayExpression,
  };

  return pluginWrapper(
    createAppModuleInternal,
    EventNames.CreateServerAppModule,
    {
      modulesFiles,
      template,
      templateMapping,
    }
  );
}

export async function createAppModuleInternal({
  modulesFiles,
  template,
  templateMapping,
}: CreateServerAppModuleParams): Promise<ModuleMap> {
  const {
    serverDirectories,
    appInfo: {
      settings: {
        serverSettings: { generateGraphQL },
      },
    },
  } = DsgContext.getInstance;

  const MODULE_PATH = `${serverDirectories.srcDirectory}/app.module.ts`;
  const nestModules = modulesFiles
    .modules()
    .filter((module) => module.path.match(MODULE_PATTERN));

  const nestModulesWithExports = nestModules.map((module) => ({
    module,
    exports: getExportedNames(module.code),
  }));
  const moduleImports = nestModulesWithExports.map(({ module, exports }) => {
    /** @todo explicitly check for "@Module" decorated classes */
    return importNames(
      // eslint-disable-next-line
      // @ts-ignore
      exports,
      relativeImportPath(MODULE_PATH, module.path)
    );
  });

  interpolate(template, templateMapping);

  const defaultImports = [
    ...moduleImports,
    importDeclaration`import { ${PRISMA_MODULE_ID} } from "./prisma/prisma.module"`,
    importDeclaration`import { ${MORGAN_MODULE_ID} } from "nest-morgan"`,
    importDeclaration`import { ${SERVE_STATIC_MODULE_ID} } from "@nestjs/serve-static"`,
    importDeclaration`import { ${SERVE_STATIC_OPTIONS_SERVICE_ID} } from "./serveStaticOptions.service"`,
  ];

  const imports = addCustomModuleImports(defaultImports, {
    createGraphQLModule: generateGraphQL,
  });

  addImports(template, imports);
  removeTSIgnoreComments(template);
  removeESLintComments(template);
  removeTSVariableDeclares(template);

  const appModule: Module = {
    path: MODULE_PATH,
    code: print(template).code,
  };
  const appModuleMap = new ModuleMap(DsgContext.getInstance.logger);
  await appModuleMap.set(appModule);
  return appModuleMap;
}

/**
 * create an array expression from the given modules and add custom modules if needed.
 * For example, the GraphQL module will be added if the app uses GraphQL
 */
function createModuleImportsArrayExpression(
  modules: (
    | namedTypes.Identifier
    | namedTypes.JSXIdentifier
    | namedTypes.TSTypeParameter
    | namedTypes.CallExpression
  )[],
  { createGraphQLModule = true }: CodeGenerationOptions
) {
  if (createGraphQLModule) {
    const graphqlCallExpression = callExpression`${GRAPHQL_MODULE_ID}.forRootAsync({
      useFactory: (configService) => {
        const playground = configService.get("GRAPHQL_PLAYGROUND");
        const introspection = configService.get("GRAPHQL_INTROSPECTION");
        return {
          autoSchemaFile: "schema.graphql",
          sortSchema: true,
          playground,
          introspection: playground || introspection
        }
      },
      inject: [${CONFIG_SERVICE_ID}],
      imports: [${CONFIG_MODULE_ID}],
    })`;

    modules.push(graphqlCallExpression);
  }

  return builders.arrayExpression(modules);
}

/**
 * add imports statements for modules that can be excluded from the app module.
 * For example, the GraphQL module imports will be added if the app uses GraphQL
 */
function addCustomModuleImports(
  defaultImports: namedTypes.ImportDeclaration[],
  { createGraphQLModule }: CodeGenerationOptions
): namedTypes.ImportDeclaration[] {
  if (createGraphQLModule) {
    defaultImports.push(
      importDeclaration`import { ${CONFIG_MODULE_ID}, ${CONFIG_SERVICE_ID} } from "@nestjs/config"`,
      importDeclaration`import { ${GRAPHQL_MODULE_ID} } from "@nestjs/graphql"`
    );
  } else {
    defaultImports.push(
      importDeclaration`import { ${CONFIG_MODULE_ID} } from "@nestjs/config"`
    );
  }
  return defaultImports;
}
