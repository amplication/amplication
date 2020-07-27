import * as recast from "recast";
import * as TypeScriptParser from "recast/parsers/typescript";
import { ASTNode, namedTypes, builders } from "ast-types";
import last from "lodash.last";
import groupBy from "lodash.groupby";
import mapValues from "lodash.mapvalues";
import uniqBy from "lodash.uniqby";
import { relativeImportPath } from "./module";
import { camelCase } from "camel-case";

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
 * Get all the import declarations from given file
 * @param file file AST representation
 * @returns array of import declarations ast nodes
 */
export function getImportDeclarations(
  file: namedTypes.File
): namedTypes.ImportDeclaration[] {
  return file.program.body.filter(
    (statement): statement is namedTypes.ImportDeclaration =>
      namedTypes.ImportDeclaration.check(statement)
  );
}

/**
 * Extract all the import declarations from given file
 * @param file file AST representation
 * @returns array of import declarations ast nodes
 */
export function extractImportDeclarations(
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

type ConstantDeclaration = namedTypes.VariableDeclaration & { kind: "const" };

/**
 * Get all the constants defined in the top level of the given file
 * @param ast file AST representation
 * @returns array of constant variable declarations ast nodes
 */
export function getTopLevelConstants(
  ast: namedTypes.File
): namedTypes.VariableDeclarator[] {
  return ast.program.body
    .filter(
      (statement): statement is ConstantDeclaration =>
        namedTypes.VariableDeclaration.check(statement) &&
        statement.kind === "const"
    )
    .flatMap(
      (declaration) =>
        declaration.declarations as namedTypes.VariableDeclarator[]
    );
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
  const ids = [];
  for (const node of file.program.body) {
    if (namedTypes.ExportNamedDeclaration.check(node)) {
      if (
        node.declaration &&
        "id" in node.declaration &&
        node.declaration.id &&
        "name" in node.declaration.id
      ) {
        ids.push(node.declaration.id);
      }
    }
  }
  return ids;
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
export function removeTSIgnoreComments(ast: ASTNode) {
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

/**
 * @param expression the expression to check
 * @param name the name to match with
 * @returns whether the expression is an identifier with the given name
 */
export function matchIdentifier(
  expression: any,
  id: namedTypes.Identifier
): boolean {
  return namedTypes.Identifier.check(expression) && expression.name === id.name;
}

/**
 * Searches for the first call expression in given AST with a callee matching the given ID
 * @param ast the AST to search in for the call statement
 * @param id the ID of the callee to match with
 */
export function findCallExpressionByCalleeId(
  ast: ASTNode,
  id: namedTypes.Identifier
): namedTypes.CallExpression | undefined {
  let expression;
  recast.visit(ast, {
    visitCallExpression(path) {
      if (matchIdentifier(path.node.callee, id)) {
        expression = path.node;
        return false;
      }
      this.traverse(path);
    },
  });
  return expression;
}

/**
 * Finds all the call expression in given AST with a callee matching the given ID
 * @param ast the AST to search in for the call statement
 * @param id the ID of the callee to match with
 */
export function findCallExpressionsByCalleeId(
  ast: ASTNode,
  id: namedTypes.Identifier
): namedTypes.CallExpression[] {
  let expressions: namedTypes.CallExpression[] = [];
  recast.visit(ast, {
    visitCallExpression(path) {
      if (matchIdentifier(path.node.callee, id)) {
        expressions.push(path.node);
      }
      this.traverse(path);
    },
  });
  return expressions;
}

/**
 * Find the first variable declarator in given AST with the given ID
 * @param ast the AST to search in for the variable declarator
 * @param id the ID of the variable to match with
 */
export function findVariableDeclaratorById(
  ast: ASTNode,
  id: namedTypes.Identifier
): namedTypes.VariableDeclarator | undefined {
  let declarator;
  recast.visit(ast, {
    visitVariableDeclarator(path) {
      if (matchIdentifier(path.node.id, id)) {
        declarator = path.node;
        return false;
      }
      this.traverse(path);
    },
  });
  return declarator;
}

export function findClassDeclarationById(
  ast: ASTNode,
  id: namedTypes.Identifier
): namedTypes.ClassDeclaration | undefined {
  let declaration;
  recast.visit(ast, {
    visitClassDeclaration(path) {
      if (matchIdentifier(path.node.id, id)) {
        declaration = path.node;
        return false;
      }
      this.traverse(path);
    },
  });
  return declaration;
}

export function singleConstantDeclaration(
  declarator: namedTypes.VariableDeclarator
): namedTypes.VariableDeclaration {
  return builders.variableDeclaration("const", [declarator]);
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

/**
 * Update import declaration source to be relative to given module
 * @param declaration import declaration to update source of
 * @param from module to relate import path
 * @returns new import declaration with the updated source
 */
export function relativeImportDeclaration(
  from: string,
  declaration: namedTypes.ImportDeclaration
): namedTypes.ImportDeclaration {
  const { source } = declaration;
  if (!namedTypes.StringLiteral.check(source)) {
    throw new Error("Declaration source must be a string literal");
  }
  return {
    ...declaration,
    source: builders.stringLiteral(relativeImportPath(from, source.value)),
  };
}

export function getInstanceId(type: namedTypes.TSType): namedTypes.Identifier {
  if (!namedTypes.TSTypeReference.check(type)) {
    throw new Error("Can only get instance ID for a type reference");
  }
  if (!namedTypes.Identifier.check(type.typeName)) {
    throw new Error(
      "Can only get instance for type reference of type identifier"
    );
  }
  return builders.identifier(camelCase(type.typeName.name));
}

export function jsonToExpression(value: any): namedTypes.Expression {
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
