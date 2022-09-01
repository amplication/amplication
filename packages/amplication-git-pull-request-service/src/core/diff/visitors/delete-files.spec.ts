import { Difference } from 'dir-compare';
import { mock } from 'jest-mock-extended';
import { deleteFilesVisitor } from './delete-files';
import { missingFolderMock } from './mocks';

describe('Testing the delete files visitor', () => {
  it('return null when its a new file', () => {
    // Arrange
    // The name1 is not existing
    const diff = mock<Difference>({});
    // Act
    const result = deleteFilesVisitor(diff);
    // Assert
    expect(result).toBeNull();
  });

  it('should ignore folders', () => {
    // Act
    const result = deleteFilesVisitor(missingFolderMock);
    // Assert
    expect(result).toBeNull();
  });
});
