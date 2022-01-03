import { generateTypeFile } from "../generate-types";
import { join } from "path";
import { DATA_TYPES } from "../../src/constants";
import { camelCase } from "lodash";
describe("Testing the generation of new type", () => {
  const schemasFolder = join(__dirname, "../..", "src/schemas");
  test.each(DATA_TYPES)("generateTypeFile(%s)", async (dataType) => {
    const name = `${camelCase(dataType)}.json`;
    const path = join(schemasFolder, name);
    expect((await generateTypeFile(path, name)).code).toMatchSnapshot();
  });
});
