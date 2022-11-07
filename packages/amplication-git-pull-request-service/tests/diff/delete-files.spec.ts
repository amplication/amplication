import { Difference } from "dir-compare";
import { mock } from "jest-mock-extended";
import { deleteFilesVisitor } from "../../src/diff/delete-files";
import { missingFolderMock } from "./mocks";

describe("Testing the delete files visitor", () => {
  it("should return null if diff indicates an addition", () => {
    // Arrange
    const diff = mock<Difference>({});
    // Act
    const result = deleteFilesVisitor(diff);
    // Assert
    expect(result).toBeNull();
  });

  it("should ignore folders", () => {
    // Act
    const result = deleteFilesVisitor(missingFolderMock);
    // Assert
    expect(result).toBeNull();
  });
});
