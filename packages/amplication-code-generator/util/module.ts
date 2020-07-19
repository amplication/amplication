import * as fs from "fs";
import * as path from "path";
import memoize from "lodash.memoize";
import * as prettier from "prettier";

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

export function relativeImportPath(from: string, to: string): string {
  const relativePath = path.relative(path.dirname(from), removeExt(to));
  return relativePath.startsWith(".") ? relativePath : "./" + relativePath;
}

function removeExt(filePath: string): string {
  const parsedPath = path.parse(filePath);
  return path.join(parsedPath.dir, parsedPath.name);
}
