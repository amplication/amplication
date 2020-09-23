import * as recast from "recast";
import * as TypeScriptParser from "recast/parsers/typescript";
import { ASTNode, namedTypes, builders } from "ast-types";
import groupBy from "lodash.groupby";
import mapValues from "lodash.mapvalues";
import uniqBy from "lodash.uniqby";

const TS_IGNORE_TEXT = "@ts-ignore";

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
 * Consolidate import declarations to a valid minimal representation
 * @todo handle multiple local imports
 * @todo handle multiple namespace, default
 * @param declarations import declarations to consolidate
 * @returns consolidated array of import declarations
 */
function consolidateImports(
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
          if (namedTypes.ImportSpecifier.check(specifier)) {
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

/**
 * Extract all the import declarations from given file
 * @param file file AST representation
 * @returns array of import declarations ast nodes
 */
function extractImportDeclarations(
  file: namedTypes.File
): namedTypes.ImportDeclaration[] {
  const newBody = [];
  const imports = [];
  for (const statement of file.program.body) {
    if (namedTypes.ImportDeclaration.check(statement)) {
      imports.push(statement);
    } else {
      newBody.push(statement);
    }
  }
  file.program.body = newBody;
  return imports;
}

/**
 * @param code JavaScript module code to get exported names from
 * @returns exported names
 */
export function getExportedNames(
  code: string
): Array<
  namedTypes.Identifier | namedTypes.JSXIdentifier | namedTypes.TSTypeParameter
> {
  const file = parse(code) as namedTypes.File;
  const ids: Array<
    | namedTypes.Identifier
    | namedTypes.JSXIdentifier
    | namedTypes.TSTypeParameter
  > = [];
  for (const node of file.program.body) {
    if (namedTypes.ExportNamedDeclaration.check(node)) {
      if (!node.declaration) {
        throw new Error("Not implemented");
      }

      if (
        "id" in node.declaration &&
        node.declaration.id &&
        "name" in node.declaration.id
      ) {
        ids.push(node.declaration.id);
      } else if ("declarations" in node.declaration) {
        for (const declaration of node.declaration.declarations) {
          if (
            "id" in declaration &&
            declaration.id &&
            "name" in declaration.id
          ) {
            ids.push(declaration.id);
          } else {
            throw new Error("Not implemented");
          }
        }
      } else {
        throw new Error("Not implemented");
      }
    }
  }
  return ids;
}

/**
 * In given AST replaces identifiers with AST nodes according to given mapping
 * @param ast AST to replace identifiers in
 * @param mapping from identifier to AST node to replace it with
 */
export function interpolate(
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
    // Recast has a bug of traversing class property decorators
    // This method fixes it
    visitClassProperty(path) {
      const childPath = path.get("decorators");
      if (childPath.value) {
        this.traverse(childPath);
      }
      this.traverse(path);
    },
    /**
     * Template literals that only hold identifiers mapped to string literals
     * are statically evaluated to string literals.
     * @example
     * ```
     * const file = parse("`Hello, ${NAME}!`");
     * interpolate(file, { NAME: builders.stringLiteral("World") });
     * print(file).code === '"Hello, World!"';
     * ```
     */
    visitTemplateLiteral(path) {
      const canTransformToStringLiteral = path.node.expressions.every(
        (expression) =>
          namedTypes.Identifier.check(expression) &&
          expression.name in mapping &&
          namedTypes.StringLiteral.check(mapping[expression.name])
      );
      if (canTransformToStringLiteral) {
        path.node.expressions = path.node.expressions.map((expression) => {
          const identifier = expression as namedTypes.Identifier;
          return mapping[identifier.name] as namedTypes.StringLiteral;
        });
        path.replace(transformTemplateLiteralToStringLiteral(path.node));
      }
      this.traverse(path);
    },
  });
}

export function transformTemplateLiteralToStringLiteral(
  templateLiteral: namedTypes.TemplateLiteral
): namedTypes.StringLiteral {
  const value = templateLiteral.quasis
    .map((quasie, i) => {
      const expression = templateLiteral.expressions[
        i
      ] as namedTypes.StringLiteral;
      if (expression) {
        return quasie.value.raw + expression.value;
      }
      return quasie.value.raw;
    })
    .join("");
  return builders.stringLiteral(value);
}

/**
 * Removes all TypeScript ignore comments
 * @param ast the AST to remove the comments from
 */
export function removeTSIgnoreComments(ast: ASTNode): void {
  recast.visit(ast, {
    visitComment(path) {
      if (path.value.value.includes(TS_IGNORE_TEXT)) {
        path.prune();
      }
      this.traverse(path);
    },
  });
}

/**
 * Removes all TypeScript variable declares
 * @param ast the AST to remove the declares from
 */
export function removeTSVariableDeclares(ast: ASTNode): void {
  recast.visit(ast, {
    visitVariableDeclaration(path) {
      if (path.get("declare").value) {
        path.prune();
      }
      this.traverse(path);
    },
  });
}

/**
 * Removes all TypeScript class declares
 * @param ast the AST to remove the declares from
 */
export function removeTSClassDeclares(ast: ASTNode): void {
  recast.visit(ast, {
    visitClassDeclaration(path) {
      if (path.get("declare").value) {
        path.prune();
      }
      this.traverse(path);
    },
  });
}

/**
 * Removes all TypeScript interface declares
 * @param ast the AST to remove the declares from
 */
export function removeTSInterfaceDeclares(ast: ASTNode): void {
  recast.visit(ast, {
    visitTSInterfaceDeclaration(path) {
      if (path.get("declare").value) {
        path.prune();
      }
      this.traverse(path);
    },
  });
}

export function importNames(
  names: namedTypes.Identifier[],
  source: string
): namedTypes.ImportDeclaration {
  return builders.importDeclaration(
    names.map((name) => builders.importSpecifier(name)),
    builders.stringLiteral(source)
  );
}

export function jsonToExpression(
  // eslint-disable-next-line
  value: any
): namedTypes.Expression {
  const variableName = "a";
  const file = parse(
    `const ${variableName} = ${JSON.stringify(value)};`
  ) as namedTypes.File;
  const [firstStatement] = file.program.body;
  if (!namedTypes.VariableDeclaration.check(firstStatement)) {
    throw new Error("Expected first statement to be a variable declaration");
  }
  const [firstDeclaration] = firstStatement.declarations;
  if (!namedTypes.VariableDeclarator.check(firstDeclaration)) {
    throw new Error("Expected first declaration to be variable declarator");
  }
  if (!firstDeclaration.init) {
    throw new Error("Expected variable init to be defined");
  }
  return firstDeclaration.init;
}

export function addImports(
  file: namedTypes.File,
  imports: namedTypes.ImportDeclaration[]
): void {
  const existingImports = extractImportDeclarations(file);
  const consolidatedImports = consolidateImports([
    ...existingImports,
    ...imports,
  ]);
  file.program.body.unshift(...consolidatedImports);
}

export function classProperty(
  key: namedTypes.Identifier,
  typeAnnotation: namedTypes.TSTypeAnnotation,
  definitive = false,
  optional = false,
  decorators: namedTypes.Decorator[] = []
): namedTypes.ClassProperty {
  if (optional && definitive) {
    throw new Error(
      "Must either provide definitive: true, optional: true or none of them"
    );
  }
  const code = `class A {
    ${decorators.map((decorator) => recast.print(decorator).code).join("\n")}
    ${recast.print(key).code}${definitive ? "!" : ""}${optional ? "?" : ""}${
    recast.print(typeAnnotation).code
  }
  }`;
  const ast = parse(code);
  const [classDeclaration] = ast.program.body;
  const [property] = classDeclaration.body.body;
  return property;
}

export function findContainedIdentifiers(
  node: ASTNode,
  identifiers: Iterable<namedTypes.Identifier>
): namedTypes.Identifier[] {
  const nameToIdentifier = Object.fromEntries(
    Array.from(identifiers, (identifier) => [identifier.name, identifier])
  );
  const contained: namedTypes.Identifier[] = [];
  recast.visit(node, {
    visitIdentifier(path) {
      if (path.node.name in nameToIdentifier) {
        contained.push(path.node);
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
    // Recast has a bug of traversing class property decorators
    // This method fixes it
    visitClassProperty(path) {
      const childPath = path.get("decorators");
      if (childPath.value) {
        this.traverse(childPath);
      }
      this.traverse(path);
    },
  });
  return contained;
}

export function importContainedIdentifiers(
  node: ASTNode,
  moduleToIdentifiers: Record<string, namedTypes.Identifier[]>
): namedTypes.ImportDeclaration[] {
  const idToModule = new Map(
    Object.entries(moduleToIdentifiers).flatMap(([key, values]) =>
      values.map((value) => [value, key])
    )
  );
  const nameToId = Object.fromEntries(
    Array.from(idToModule.keys(), (identifier) => [identifier.name, identifier])
  );
  const containedIds = findContainedIdentifiers(node, idToModule.keys());
  const moduleToContainedIds = groupBy(containedIds, (id) => {
    const knownId = nameToId[id.name];
    const module = idToModule.get(knownId);
    return module;
  });
  return Object.entries(moduleToContainedIds).map(([module, containedIds]) =>
    importNames(containedIds, module)
  );
}
