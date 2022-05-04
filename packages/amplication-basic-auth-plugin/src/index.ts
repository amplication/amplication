import path from "path";
import { Module } from "./types/module";
import { readStaticModules } from './read-static-modules';

export async function createPluginModule(authPath: string): Promise<Module[]> {

  const modules = readStaticModules(path.join(__dirname, 'static'), authPath)

  return modules;
}
