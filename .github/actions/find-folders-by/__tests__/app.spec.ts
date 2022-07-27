import { App } from '../src/services/app';
import { ActionProvider } from '../src/providers/action-provider.interface';
import { anyString, mock, MockProxy, mockReset } from 'jest-mock-extended';
import { StorageProvider } from '../src/providers/storage-provider.interface';

const actionProviderMock: MockProxy<ActionProvider> = mock<ActionProvider>();
const storageProvider: MockProxy<StorageProvider> = mock<StorageProvider>();

const app: App = new App(actionProviderMock, storageProvider);
const WORKING_DIRECTORY = 'workingDirectory';
const FILES_TO_FIND: string[] = ['filesToFind1', 'filesToFind2'];
const FOLDERS_TO_SEARCH: string[] = ['foldersToSearch1', 'foldersToSearch2'];
const IGNORE_FOLDERS: string[] = ['ignoreFolders', 'ignoreFolders'];
const RECURSIVE = true;

beforeEach(() => {
  mockReset(actionProviderMock);
  mockReset(storageProvider);
});


describe('App main function tests', () => {
  // test stuff

  test('all folders contains files to find should return all folders - without recursion', () => {
    //ARRANGE
    setupActionProviderMock(undefined, undefined, undefined, undefined, false);

    storageProvider.directoryContains
      .calledWith(anyString(), FILES_TO_FIND)
      .mockReturnValue(true);

    //ACT
    app.main();

    //ASSERT
    expect(actionProviderMock.setOutput).toBeCalledWith(FOLDERS_TO_SEARCH);
    expect(storageProvider.getSubDirectories).toBeCalledTimes(0); //recursion - false
  });

  test('only one folder contains files to find, should return only folder that contains the file - without recursion', () => {
    //ARRANGE
    setupActionProviderMock(undefined, undefined, undefined, undefined, false);

    storageProvider.directoryContains.mockImplementation(
      (path, folders_to_search) =>
        path === `${WORKING_DIRECTORY}/${FOLDERS_TO_SEARCH[0]}` &&
        folders_to_search === FILES_TO_FIND
    );

    //ACT
    app.main();

    //ASSERT
    expect(actionProviderMock.setOutput).toBeCalledWith([FOLDERS_TO_SEARCH[0]]);
    expect(storageProvider.getSubDirectories).toBeCalledTimes(0); //recursion - false
  });

  test('recursion is enabled and sub directory contains the files that are searched - should return the sub folder', () => {
    //ARRANGE
    setupActionProviderMock(undefined, undefined, undefined, undefined, true);

    storageProvider.directoryContains.mockImplementation(
      (path) => `${WORKING_DIRECTORY}/${FOLDERS_TO_SEARCH[1]}/test` === path
    );

    storageProvider.getSubDirectories.mockImplementation((path) =>
      `${WORKING_DIRECTORY}/${FOLDERS_TO_SEARCH[1]}` === path ? ['test'] : []
    );

    //ACT
    app.main();

    //ASSERT
    expect(actionProviderMock.setOutput).toBeCalledWith([
      `${FOLDERS_TO_SEARCH[1]}/test`,
    ]);
    expect(storageProvider.getSubDirectories).toBeCalledTimes(2); // FOLDERS_TO_SEARCH[0],FOLDERS_TO_SEARCH[1] recursion - true
  });

  test('recursion is enabled and sub directory contains the files that are searched but the folder is under an ignored folder - should return empty list', () => {
    //ARRANGE
    setupActionProviderMock(
      undefined,
      undefined,
      undefined,
      [FOLDERS_TO_SEARCH[1]],
      true
    );

    storageProvider.directoryContains.mockImplementation(
      (path) => `${WORKING_DIRECTORY}/${FOLDERS_TO_SEARCH[1]}/test` === path
    );

    storageProvider.getSubDirectories.mockImplementation((path) =>
      `${WORKING_DIRECTORY}/${FOLDERS_TO_SEARCH[1]}` === path ? ['test'] : []
    );

    //ACT
    app.main();

    //ASSERT
    expect(actionProviderMock.setOutput).toBeCalledWith([]);
    expect(storageProvider.getSubDirectories).toHaveBeenCalledTimes(1); //FOLDERS_TO_SEARCH[0]
  });

  test('recursion is enabled and sub directory contains the files that are searched, a folder is under an ignored folder list - should return the folder containing the file and skip the folder from the ignored list', () => {
    //ARRANGE
    setupActionProviderMock(
      undefined,
      undefined,
      undefined,
      [FOLDERS_TO_SEARCH[0]],
      true
    );

    storageProvider.directoryContains.mockImplementation(
      (path) => `${WORKING_DIRECTORY}/${FOLDERS_TO_SEARCH[1]}/test` === path
    );

    storageProvider.getSubDirectories.mockImplementation((path) =>
      `${WORKING_DIRECTORY}/${FOLDERS_TO_SEARCH[1]}` === path
        ? ['test', 'test2']
        : []
    );

    //ACT
    app.main();

    //ASSERT
    expect(actionProviderMock.setOutput).toBeCalledWith([
      `${FOLDERS_TO_SEARCH[1]}/test`,
    ]);
    expect(storageProvider.getSubDirectories).toHaveBeenCalledTimes(2); //FOLDERS_TO_SEARCH[1],FOLDERS_TO_SEARCH[1]/test2
  });
});

const setupActionProviderMock: (
  workingDirectory?: string,
  filesToFind?: string[],
  foldersToSearch?: string[],
  ignoreFolders?: string[],
  recursive?: boolean
) => void = (
  workingDirectory: string = WORKING_DIRECTORY,
  filesToFind: string[] = FILES_TO_FIND,
  foldersToSearch: string[] = FOLDERS_TO_SEARCH,
  ignoreFolders: string[] = IGNORE_FOLDERS,
  recursive: boolean = RECURSIVE
) => {
  actionProviderMock.getWorkingDirectory
    .calledWith()
    .mockReturnValue(workingDirectory);
  actionProviderMock.getRecursive.calledWith().mockReturnValue(recursive);
  actionProviderMock.getIgnoreFolders
    .calledWith()
    .mockReturnValue(ignoreFolders);
  actionProviderMock.getFoldersToSearch
    .calledWith()
    .mockReturnValue(foldersToSearch);
  actionProviderMock.getFilesToFined.calledWith().mockReturnValue(filesToFind);
};
