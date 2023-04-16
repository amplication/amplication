import { CLONES_FOLDER_ENV, getCloneDir } from "./clone-dir";
import { MissingEnvParam } from "../errors/MissingEnvParam";

describe("Testing the cloneDir getter function", () => {
  it("should throw an error if the CLONES_FOLDER environment variable is not set", () => {
    // Arrange
    const owner = "owner";
    const repositoryName = "repositoryName";
    const params = { owner, repositoryName };
    const expectedError = new MissingEnvParam(CLONES_FOLDER_ENV);
    // Act
    const actual = () => getCloneDir(params);
    // Assert
    expect(actual).toThrow(expectedError);
  });
});
