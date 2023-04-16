import { CLONES_FOLDER_ENV, getCloneDir } from "./clone-dir";
import { MissingEnvParam } from "../errors/MissingEnvParam";
import { EnumGitProvider } from "../types";

describe("Testing the cloneDir getter function", () => {
  it("should throw an error if the CLONES_FOLDER environment variable is not set", () => {
    // Arrange
    const owner = "owner";
    const repositoryName = "repositoryName";
    const provider = EnumGitProvider.Github;
    const params = { owner, repositoryName, provider };
    const expectedError = new MissingEnvParam(CLONES_FOLDER_ENV);
    // Act
    const actual = () => getCloneDir(params);
    // Assert
    expect(actual).toThrow(expectedError);
  });

  it("should return a full path to the clone directory", () => {
    // Arrange
    const owner = "owner";
    const repositoryName = "repositoryName";
    const provider = EnumGitProvider.Github;
    const params = { owner, repositoryName, provider };
    const cloneFolder = "path/to/clone/folder";
    const expected = `${cloneFolder}/${provider}/${owner}/${repositoryName}`;
    process.env.CLONES_FOLDER = cloneFolder;
    // Act
    const actual = getCloneDir(params);
    // Assert
    expect(actual).toBe(expected);
  });
  it("should return a full path to the clone directory with suffix", () => {
    // Arrange
    const owner = "owner";
    const repositoryName = "repositoryName";
    const provider = EnumGitProvider.Github;
    const suffix = "suffix";
    const params = { owner, repositoryName, provider, suffix };
    const cloneFolder = "path/to/clone/folder";
    const expected = `${cloneFolder}/${provider}/${owner}/${repositoryName}/${suffix}`;
    process.env.CLONES_FOLDER = cloneFolder;
    // Act
    const actual = getCloneDir(params);
    // Assert
    expect(actual).toBe(expected);
  });
});
