import { namedTypes, builders } from "ast-types";
import { pascalCase } from "pascal-case";
import { importNames } from "./ast";

export const PRISMA_CLIENT_MODULE = "@prisma/client";

export enum PrismaAction {
  FindOne = "FindOne",
  FindMany = "FindMany",
  Create = "Create",
}

export function createPrismaArgsID(
  action: PrismaAction,
  entity: string
): namedTypes.Identifier {
  return builders.identifier(`${action}${pascalCase(entity)}Args`);
}

export function createPrismaEntityID(entity: string) {
  return builders.identifier(pascalCase(entity));
}

export function importNamesFromPrisma(
  names: namedTypes.Identifier[]
): namedTypes.ImportDeclaration {
  return importNames(names, PRISMA_CLIENT_MODULE);
}
