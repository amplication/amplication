import { BuildPathFactory } from "../../src/diff/build-path-factory";
import { Difference } from "dir-compare";
import { mock } from "jest-mock-extended";

export const MOCK_BUILD_PATH_FACTORY = mock<BuildPathFactory>();

export const missingFolderMock = mock<Difference>({
  name1: "name1",
  type1: "directory",
  type2: "missing",
  state: "left",
});
