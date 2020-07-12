import * as fs from "fs";
import * as path from "path";
import memoize from "lodash.memoize";
import * as prettier from "prettier";

export type Variables = { [variable: string]: string | null | undefined };

export type Module = {
  path: string;
  code: string;
};

export type ImportableModule = Module & {
  exports: string[];
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
  variables: Variables,
  exports: string[]
): Promise<ImportableModule> {
  const template = await readCode(templatePath);
  /** @todo get exports from code */
  const code = interpolate(template, variables);
  return {
    path: modulePath,
    code,
    exports,
  };
}

export async function writeModules(
  modules: Module[],
  outputDirectory: string
): Promise<void> {
  await fs.promises.rmdir(outputDirectory, {
    recursive: true,
  });
  await fs.promises.mkdir(outputDirectory);
  for (const module of modules) {
    await fs.promises.writeFile(
      path.join(outputDirectory, module.path),
      prettier.format(module.code, { parser: "typescript" }),
      "utf-8"
    );
  }
}

export { readCode };
