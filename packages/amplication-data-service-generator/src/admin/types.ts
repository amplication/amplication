import { namedTypes } from "ast-types";

export type EntityComponent = {
  name: string;
  file: namedTypes.File;
  modulePath: string;
};

export type EntityComponents = {
  create: EntityComponent;
  list: EntityComponent;
  update: EntityComponent;
};
