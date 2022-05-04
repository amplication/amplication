
import recast from "recast";
import { memoize } from "lodash";
import * as fs from "fs";
import { namedTypes } from "ast-types";

type Module = {
  path: string;
  code: string;
};

export const readCode = memoize(
  (path: string): Promise<string> => {
    return fs.promises.readFile(path, "utf-8");
  }
);

const readFile = async (path: string): Promise<namedTypes.File> => {
  const code = await readCode(path);
  return recast.parse(code) as namedTypes.File;
};

export async function createPluginModule(authPath: string): Promise<Module> {

  fs.copyFileSync('./static', authPath)

  const defaultAuthGuardPath = require.resolve(
    "./defaultAuth.guard.template.ts"
  );
  
  const modulePath = `${authPath}/defaultAuth.guard.ts`;

  const templateGuardFile = await readFile(defaultAuthGuardPath);

  return { path: modulePath, code: recast.print(templateGuardFile).code };
}
