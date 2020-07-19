import * as fs from "fs";
import * as path from "path";
import memoize from "lodash.memoize";
import * as prettier from "prettier";
import * as parser from "@babel/parser";
import * as recast from "recast";
import * as TypeScriptParser from "recast/parsers/typescript";
import { ASTNode, namedTypes, builders } from "ast-types";
import last from "lodash.last";
import groupBy from "lodash.groupby";
import mapValues from "lodash.mapvalues";
import uniqBy from "lodash.uniqby";

export type Variables = { [variable: string]: string | null | undefined };

export type Module = {
  path: string;
  code: string;
};

export function interpolate(code: string, variables: Variables) {
  for (const [variable, value] of Object.entries(variables)) {
    if (!value) {
      continue;
    }
    const pattern = new RegExp("\\$\\$" + variable + "\\$\\$", "g");
    code = code.replace(pattern, value);
  }
  return code;
}

/**
 * Wraps recast.parse()
 * Sets parser to use the TypeScript parser
 */
export function parse(
  source: string,
  options?: Partial<Omit<recast.Options, "parser">>
): any {
  return recast.parse(source, {
    ...options,
    parser: TypeScriptParser,
  });
}

/**
 * In given AST replaces identifiers with AST nodes according to given mapping
 * @param ast AST to replace identifiers in
 * @param mapping from identifier to AST node to replace it with
 */
export function interpolateAST(
  ast: ASTNode,
  mapping: { [key: string]: ASTNode }
): void {
  return recast.visit(ast, {
    visitIdentifier(path) {
      const { name } = path.node;
      if (mapping.hasOwnProperty(name)) {
        const replacement = mapping[name];
        path.replace(replacement);
      }
      this.traverse(path);
    },
    // Recast has a bug of traversing class decorators
    // This method fixes it
    visitClassDeclaration(path) {
      const childPath = path.get("decorators");
      if (childPath.value) {
        this.traverse(childPath);
      }
      return this.traverse(path);
    },
  });
}

/**
 * Like builders.commentBlock but for doc comments
 * @param value the documentation comment value
 * @param leading whether the comment should be before the node
 * @param trailing whether the comment should be after the node
 */
export function docComment(
  value: string,
  leading: boolean = true,
  trailing: boolean = false
): namedTypes.CommentBlock {
  return builders.commentBlock(`* ${value} `, leading, trailing);
}

/**
 * Extracts the last statement from a template file
 * @param ast the file AST node
 * @returns the statement AST node
 */
export function getLastStatementFromFile(
  ast: namedTypes.File
): namedTypes.Statement {
  return last(ast.program.body) as namedTypes.Statement;
}

/**
 * Extracts a single class method from a mixin class in a template file
 * Assumes the last statement in the file is a class declaration and the last
 * member in it is the class method
 * @param ast the template file AST representation
 * @returns the class method AST node
 */
export function getMethodFromTemplateAST(
  ast: namedTypes.File
): namedTypes.ClassMethod {
  const mixin = getLastStatementFromFile(ast) as namedTypes.ClassDeclaration;
  const method = last(mixin.body.body);
  return method as namedTypes.ClassMethod;
}

const readCode = memoize(
  (path: string): Promise<string> => fs.promises.readFile(path, "utf-8")
);

export async function createModuleFromTemplate(
  modulePath: string,
  templatePath: string,
  variables: Variables
): Promise<Module> {
  const template = await readCode(templatePath);
  const code = interpolate(template, variables);
  return {
    path: modulePath,
    code,
  };
}

export async function writeModules(
  modules: Module[],
  outputDirectory: string
): Promise<void> {
  await fs.promises.rmdir(outputDirectory, {
    recursive: true,
  });
  for (const module of modules) {
    const filePath = path.join(outputDirectory, module.path);
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.writeFile(
      filePath,
      prettier.format(module.code, { parser: "typescript" }),
      "utf-8"
    );
  }
}

export { readCode };

/**
 * @param code JavaScript module code to get exported names from
 * @returns exported names
 */
export function getExportedNames(code: string): string[] {
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["typescript", "decorators-legacy"],
  });
  const names = [];
  for (const node of ast.program.body) {
    if (node.type === "ExportNamedDeclaration") {
      if (
        node.declaration &&
        "id" in node.declaration &&
        node.declaration.id &&
        "name" in node.declaration.id
      ) {
        names.push(node.declaration.id.name);
      }
    }
  }
  return names;
}

/**
 * Get all the import declarations from given file
 * @param ast file AST representation
 * @returns array of import declarations ast nodes
 */
export function getImportDeclarations(
  ast: namedTypes.File
): namedTypes.ImportDeclaration[] {
  return ast.program.body.filter(
    (statement): statement is namedTypes.ImportDeclaration =>
      statement.type === "ImportDeclaration"
  );
}

/**
 * Consolidate import declarations to a valid minimal representation
 * @todo handle multiple local imports
 * @todo handle multiple namespace, default
 * @param declarations import declarations to consolidate
 * @returns consolidated array of import declarations
 */
export function consolidateImports(
  declarations: namedTypes.ImportDeclaration[]
): namedTypes.ImportDeclaration[] {
  const moduleToDeclarations = groupBy(
    declarations,
    (declaration) => declaration.source.value
  );
  const moduleToDeclaration = mapValues(
    moduleToDeclarations,
    (declarations, module) => {
      const specifiers = uniqBy(
        declarations.flatMap((declaration) => declaration.specifiers || []),
        (specifier) => {
          if (specifier.type === "ImportSpecifier") {
            return specifier.imported.name;
          }
          return specifier.type;
        }
      );
      return builders.importDeclaration(
        specifiers,
        builders.stringLiteral(module)
      );
    }
  );
  return Object.values(moduleToDeclaration);
}

export function relativeImportPath(from: string, to: string): string {
  const relativePath = path.relative(path.dirname(from), removeExt(to));
  return relativePath.startsWith(".") ? relativePath : "./" + relativePath;
}

function removeExt(filePath: string): string {
  const parsedPath = path.parse(filePath);
  return path.join(parsedPath.dir, parsedPath.name);
}
