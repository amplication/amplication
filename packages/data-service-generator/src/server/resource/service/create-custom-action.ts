import { ModuleAction } from "@amplication/code-gen-types";
import { readFile } from "@amplication/code-gen-utils";
import { builders, namedTypes } from "ast-types";
import {
  getClassDeclarationById,
  getMethods,
  interpolate,
} from "../../../utils/ast";
import { createPropTypeFromTypeDefList } from "../dto/custom-types/create-property-type";

const MIXIN_ID = builders.identifier("Mixin");
const templatePath = require.resolve("./create-custom-action.template.ts");

export async function createCustomActionMethods(
  actions: ModuleAction[]
): Promise<namedTypes.ClassMethod[]> {
  if (!actions || actions.length === 0) {
    return [];
  }

  const methods = (
    await Promise.all(
      actions.map(async (action) => {
        const actionFile = await createActionFile(action);

        const methods = getMethods(
          getClassDeclarationById(actionFile, MIXIN_ID)
        );
        return methods;
      })
    )
  ).flat();

  return methods;
}

async function createActionFile(action: ModuleAction) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const toManyFile = await readFile(templatePath);

  interpolate(toManyFile, {
    ACTION_NAME: builders.identifier(action.name),
    RETURN_TYPE: createPropTypeFromTypeDefList([action.outputType]),
    INPUT_TYPE: createPropTypeFromTypeDefList([action.inputType]),
  });

  return toManyFile;
}
