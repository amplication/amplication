import * as recast from "recast";
import { ParserOptions } from "@babel/parser";
import { ASTNode, namedTypes, builders } from "ast-types";
import * as K from "ast-types/gen/kinds";
import { NodePath } from "ast-types/lib/node-path";
import groupBy from "lodash.groupby";
import mapValues from "lodash.mapvalues";
import uniqBy from "lodash.uniqby";
import * as parser from "./parser";
import * as partialParser from "./partial-parser";

export type ClassDeclaration = namedTypes.ClassDeclaration & {
  decorators: namedTypes.Decorator[];
};

export type NamedClassDeclaration = ClassDeclaration & {
  id: namedTypes.Identifier;
};

export type NamedClassProperty = namedTypes.ClassProperty & {
  key: namedTypes.Identifier;
  typeAnnotation: namedTypes.TSTypeAnnotation;
  optional?: boolean;
};

const TS_IGNORE_TEXT = "@ts-ignore";
const CONSTRUCTOR_NAME = "constructor";
const ARRAY_ID = builders.identifier("Array");

type ParseOptions = Omit<recast.Options, "parser">;
type PartialParseOptions = Omit<ParserOptions, "tolerant">;

export class ParseError extends SyntaxError {
  constructor(message: string, source: string) {
    super(`${message}\nSource:\n${source}`);
  }
}

/**
 * Wraps recast.parse()
 * Sets parser to use the TypeScript parser
 */
export function parse(source: string, options?: ParseOptions): namedTypes.File {
  try {
    return recast.parse(source, {
      ...options,
      parser,
    });
  } catch (error) {
    if (error.constructor === SyntaxError) {
      throw new ParseError(error.message, source);
    }
    throw error;
  }
}

/**
 * Wraps recast.parse()
 * Sets parser to use the TypeScript parser with looser restrictions
 */
export function partialParse(
  source: string,
  options?: PartialParseOptions
): namedTypes.File {
  try {
    return recast.parse(source, {
      ...options,
      tolerant: true,
      parser: partialParser,
    });
  } catch (error) {
    if (error.constructor === SyntaxError) {
      throw new ParseError(error.message, source);
    }
    throw error;
  }
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
  mapping: { [key: string]: ASTNode | undefined }
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
    // Recast has a bug of traversing TypeScript call expression type parameters
    visitCallExpression(path) {
      const childPath = path.get("typeParameters");
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
    visitJSXElement(path) {
      evaluateJSX(path, mapping);
      this.traverse(path);
    },
    visitJSXFragment(path) {
      evaluateJSX(path, mapping);
      this.traverse(path);
    },
  });
}

export function evaluateJSX(
  path: NodePath,
  mapping: { [key: string]: ASTNode | undefined }
): void {
  const childrenPath = path.get("children");
  childrenPath.each(
    (
      childPath: NodePath<
        | K.JSXTextKind
        | K.JSXExpressionContainerKind
        | K.JSXSpreadChildKind
        | K.JSXElementKind
        | K.JSXFragmentKind
        | K.LiteralKind
      >
    ) => {
      const { node } = childPath;
      if (
        namedTypes.JSXExpressionContainer.check(node) &&
        namedTypes.Identifier.check(node.expression)
      ) {
        const { expression } = node;
        const mapped = mapping[expression.name];
        if (namedTypes.JSXElement.check(mapped)) {
          childPath.replace(mapped);
        } else if (namedTypes.StringLiteral.check(mapped)) {
          childPath.replace(builders.jsxText(mapped.value));
        } else if (namedTypes.JSXFragment.check(mapped) && mapped.children) {
          childPath.replace(...mapped.children);
        }
      }
    }
  );
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
 * Like removeTSIgnoreComments but removes TypeScript ignore comments from
 * imports only
 * @param file file to remove comments from
 */
export function removeImportsTSIgnoreComments(file: namedTypes.File): void {
  for (const statement of file.program.body) {
    if (!namedTypes.ImportDeclaration.check(statement)) {
      break;
    }
    removeTSIgnoreComments(statement);
  }
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
 * Removes all ESLint comments
 * @param ast the AST to remove the comments from
 */
export function removeESLintComments(ast: ASTNode): void {
  recast.visit(ast, {
    visitComment(path) {
      const comment = path.value as namedTypes.Comment;
      if (comment.value.match(/^\s+eslint-disable/)) {
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

export function exportNames(
  names: namedTypes.Identifier[]
): namedTypes.ExportNamedDeclaration {
  return builders.exportNamedDeclaration(
    null,
    names.map((name) =>
      builders.exportSpecifier.from({
        exported: name,
        id: name,
        name,
      })
    )
  );
}

export function classDeclaration(
  id: K.IdentifierKind | null,
  body: K.ClassBodyKind,
  superClass: K.ExpressionKind | null = null,
  decorators: namedTypes.Decorator[] = []
): namedTypes.ClassDeclaration {
  const declaration = builders.classDeclaration(id, body, superClass);
  if (!decorators.length) {
    return declaration;
  }
  const code = [
    ...decorators.map((decorator) => recast.print(decorator).code),
    recast.print(declaration).code,
  ].join("\n");
  const ast = parse(code);
  const [classDeclaration] = ast.program.body as [namedTypes.ClassDeclaration];
  return classDeclaration;
}

export function classProperty(
  key: namedTypes.Identifier,
  typeAnnotation: namedTypes.TSTypeAnnotation,
  definitive = false,
  optional = false,
  defaultValue: namedTypes.Expression | null = null,
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
  }${defaultValue ? `= ${recast.print(defaultValue).code}` : ""}
  
  }`;
  const ast = parse(code);
  const [classDeclaration] = ast.program.body as [namedTypes.ClassDeclaration];
  const [property] = classDeclaration.body.body;
  return property as namedTypes.ClassProperty;
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
      if (nameToIdentifier.hasOwnProperty(path.node.name)) {
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

/**
 * Finds class declaration in provided AST node, if no class is found throws an exception
 * @param node AST node which includes the desired class declaration
 * @param id the identifier of the desired class
 * @returns a class declaration with a matching identifier to the one given in the given AST node
 */
export function getClassDeclarationById(
  node: ASTNode,
  id: namedTypes.Identifier
): namedTypes.ClassDeclaration {
  let classDeclaration: namedTypes.ClassDeclaration | null = null;
  recast.visit(node, {
    visitClassDeclaration(path) {
      if (path.node.id && path.node.id.name === id.name) {
        classDeclaration = path.node;
        return false;
      }
      return this.traverse(path);
    },
  });

  if (!classDeclaration) {
    throw new Error(
      `Could not find class declaration with the identifier ${id.name} in provided AST node`
    );
  }

  return classDeclaration;
}

export function deleteClassMemberByKey(
  declaration: namedTypes.ClassDeclaration,
  id: namedTypes.Identifier
): void {
  for (const [index, member] of declaration.body.body.entries()) {
    if (
      member &&
      "key" in member &&
      namedTypes.Identifier.check(member.key) &&
      member.key.name === id.name
    ) {
      delete declaration.body.body[index];
      break;
    }
  }
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

export function isConstructor(method: namedTypes.ClassMethod): boolean {
  return (
    namedTypes.Identifier.check(method.key) &&
    method.key.name === CONSTRUCTOR_NAME
  );
}

/**
 * Returns the constructor of the given classDeclaration
 * @param classDeclaration
 */
export function findConstructor(
  classDeclaration: namedTypes.ClassDeclaration
): namedTypes.ClassMethod | undefined {
  return classDeclaration.body.body.find(
    (member): member is namedTypes.ClassMethod =>
      namedTypes.ClassMethod.check(member) && isConstructor(member)
  );
}

/**
 * Add an identifier to the super() call in the constructor
 * @param classDeclaration
 */
export function addIdentifierToConstructorSuperCall(
  ast: ASTNode,
  identifier: namedTypes.Identifier
): void {
  recast.visit(ast, {
    visitClassMethod(path) {
      const classMethodNode = path.node;
      if (isConstructor(classMethodNode)) {
        recast.visit(classMethodNode, {
          visitCallExpression(path) {
            const callExpressionNode = path.node;

            if (callExpressionNode.callee.type === "Super") {
              callExpressionNode.arguments.push(identifier);
            }
            this.traverse(path);
          },
        });
      }

      this.traverse(path);
    },
  });
}

export function getMethods(
  classDeclaration: namedTypes.ClassDeclaration
): namedTypes.ClassMethod[] {
  return classDeclaration.body.body.filter(
    (member): member is namedTypes.ClassMethod =>
      namedTypes.ClassMethod.check(member) && !isConstructor(member)
  );
}

export function getNamedProperties(
  declaration: namedTypes.ClassDeclaration
): NamedClassProperty[] {
  return declaration.body.body.filter(
    (member): member is NamedClassProperty =>
      namedTypes.ClassProperty.check(member) &&
      namedTypes.Identifier.check(member.key)
  );
}

export const importDeclaration = typedStatement(namedTypes.ImportDeclaration);
export const callExpression = typedExpression(namedTypes.CallExpression);
export const memberExpression = typedExpression(namedTypes.MemberExpression);
export const awaitExpression = typedExpression(namedTypes.AwaitExpression);
export const logicalExpression = typedExpression(namedTypes.LogicalExpression);
export const expressionStatement = typedStatement(
  namedTypes.ExpressionStatement
);

export function typedExpression<T>(type: { check(v: any): v is T }) {
  return (
    strings: TemplateStringsArray,
    ...values: Array<namedTypes.ASTNode | namedTypes.ASTNode[] | string>
  ): T => {
    const exp = expression(strings, ...values);
    if (!type.check(exp)) {
      throw new Error(`Code must define a single ${type} at the top level`);
    }
    return exp;
  };
}

export function typedStatement<T>(type: { check(v: any): v is T }) {
  return (
    strings: TemplateStringsArray,
    ...values: Array<namedTypes.ASTNode | namedTypes.ASTNode[] | string>
  ): T => {
    const exp = statement(strings, ...values);
    if (!type.check(exp)) {
      throw new Error(`Code must define a single ${type} at the top level`);
    }
    return exp;
  };
}

export function expression(
  strings: TemplateStringsArray,
  ...values: Array<namedTypes.ASTNode | namedTypes.ASTNode[] | string>
): namedTypes.Expression {
  const stat = statement(strings, ...values);
  if (!namedTypes.ExpressionStatement.check(stat)) {
    throw new Error(
      "Code must define a single statement expression at the top level"
    );
  }
  return stat.expression;
}

export function statement(
  strings: TemplateStringsArray,
  ...values: Array<namedTypes.ASTNode | namedTypes.ASTNode[] | string>
): namedTypes.Statement {
  const code = codeTemplate(strings, ...values);
  const file = partialParse(code);
  if (file.program.body.length !== 1) {
    throw new Error("Code must have exactly one statement");
  }
  const [firstStatement] = file.program.body;
  return firstStatement;
}

function codeTemplate(
  strings: TemplateStringsArray,
  ...values: Array<namedTypes.ASTNode | namedTypes.ASTNode[] | string>
): string {
  return strings
    .flatMap((string, i) => {
      const value = values[i];
      if (typeof value === "string") return [string, value];
      return [
        string,
        Array.isArray(value)
          ? value.map((item) => recast.print(item).code).join("")
          : recast.print(value).code,
      ];
    })
    .join("");
}

export function createGenericArray(
  itemType: K.TSTypeKind
): namedTypes.TSTypeReference {
  return builders.tsTypeReference(
    ARRAY_ID,
    builders.tsTypeParameterInstantiation([itemType])
  );
}
