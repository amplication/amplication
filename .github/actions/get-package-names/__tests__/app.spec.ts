import { App } from '../src/services/app';
import { deleteFolder, randomString, writeFile } from '../src/utils/utils';
import { ActionProvider } from '../src/providers/action-provider.interface';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';

const MOCK_FOLDER = '__mocks__';
const MOCKS_FOLDER = `${process.cwd()}/${MOCK_FOLDER}`;
const nameKey = 'name';
const nameValue = 'test';

const actionProviderMock: MockProxy<ActionProvider> = mock<ActionProvider>();
let app: App = new App(actionProviderMock);

beforeEach(() => {
  deleteFolder(MOCK_FOLDER);
  mockReset(actionProviderMock);
  app = new App(actionProviderMock);
});

afterEach(() => {
  deleteFolder(MOCK_FOLDER);
});

const prepareFolder = (
  folder: string,
  nameKey: string,
  nameValue: string,
  fileName: string
) =>
  writeFile(
    `${MOCK_FOLDER}/${folder}/${fileName}`,
    `{"${nameKey}":"${nameValue}"}`
  );

describe('App main function tests', () => {
  // test stuff

  test('Finding app name for a single folder - folder has package.json file should return array with folder app name', () => {
    //ARRANGE
    const FOLDER_NAME: string = randomString();
    const fileName = 'package.json';
    actionProviderMock.getWorkingDirectory
      .calledWith()
      .mockReturnValue(MOCKS_FOLDER);

    actionProviderMock.getFolders.calledWith().mockReturnValue([FOLDER_NAME]);

    prepareFolder(FOLDER_NAME, nameKey, nameValue, fileName);

    //ACT
    app.main();

    //ASSERT
    expect(actionProviderMock.setOutput).toBeCalledWith([
      {
        folder: FOLDER_NAME,
        name: nameValue,
      },
    ]);
  });

  test("Finding app name for a single folder - folder doesn't have package.json file should return empty array", () => {
    //ARRANGE
    const FOLDER_NAME: string = randomString();
    const fileName = 'package';
    actionProviderMock.getWorkingDirectory
      .calledWith()
      .mockReturnValue(MOCKS_FOLDER);

    actionProviderMock.getFolders.calledWith().mockReturnValue([FOLDER_NAME]);

    prepareFolder(FOLDER_NAME, nameKey, nameValue, fileName);

    //ACT
    app.main();

    //ASSERT
    expect(actionProviderMock.setOutput).toHaveBeenCalledWith([]);
  });

  test('Failing to retrieve folders input should exit with an error', () => {
    //ARRANGE
    const error = new Error();
    actionProviderMock.getWorkingDirectory
      .calledWith()
      .mockReturnValue(MOCKS_FOLDER);

    actionProviderMock.getFolders.calledWith().mockImplementation(() => {
      throw error;
    });

    //ACT
    app.main();

    //ASSERT
    expect(actionProviderMock.setOutput).toHaveBeenCalledTimes(0);
    expect(actionProviderMock.setFailed).toHaveBeenCalledWith(error);
  });

  test('Failing to retrieve working directory environment should exit with an error', () => {
    //ARRANGE
    const error = new Error();
    const FOLDER_NAME: string = randomString();

    actionProviderMock.getWorkingDirectory
      .calledWith()
      .mockImplementation(() => {
        throw error;
      });

    actionProviderMock.getFolders.calledWith().mockReturnValue([FOLDER_NAME]);

    //ACT
    app.main();

    //ASSERT
    expect(actionProviderMock.setOutput).toHaveBeenCalledTimes(0);
    expect(actionProviderMock.setFailed).toHaveBeenCalledWith(error);
  });

  test('Finding app name for a multiple folders - folders has package.json file, should return array with folders app names', () => {
    //ARRANGE
    const FOLDER_NAME: string = randomString();
    const fileName = 'package.json';
    actionProviderMock.getWorkingDirectory
      .calledWith()
      .mockReturnValue(MOCKS_FOLDER);

    actionProviderMock.getFolders
      .calledWith()
      .mockReturnValue([FOLDER_NAME, FOLDER_NAME]);

    prepareFolder(FOLDER_NAME, nameKey, nameValue, fileName);

    //ACT
    app.main();

    //ASSERT
    expect(actionProviderMock.setOutput).toBeCalledWith([
      {
        folder: FOLDER_NAME,
        name: nameValue,
      },
      {
        folder: FOLDER_NAME,
        name: nameValue,
      },
    ]);
  });

  test("Finding app name for a multiple folders - one folder doesn't have package.json file, should return array with folders app names without the folder with a missing package.json", () => {
    //ARRANGE
    const FOLDER_NAME1: string = randomString();
    const fileName1 = 'package.json';
    const FOLDER_NAME2: string = randomString();
    const fileName2 = 'package';
    actionProviderMock.getWorkingDirectory
      .calledWith()
      .mockReturnValue(MOCKS_FOLDER);

    actionProviderMock.getFolders
      .calledWith()
      .mockReturnValue([FOLDER_NAME1, FOLDER_NAME2]);

    prepareFolder(FOLDER_NAME1, nameKey, nameValue, fileName1);
    prepareFolder(FOLDER_NAME2, nameKey, nameValue, fileName2);

    //ACT
    app.main();

    //ASSERT
    expect(actionProviderMock.setOutput).toHaveBeenCalledWith([
      {
        folder: FOLDER_NAME1,
        name: nameValue,
      },
    ]);
  });

  test("Finding app name for a multiple folders - one folder package.json file doesn't contains app name, should return array with folders app names without the folder with a missing package.json", () => {
    //ARRANGE
    const FOLDER_NAME1: string = randomString();
    const fileName = 'package.json';
    const FOLDER_NAME2: string = randomString();
    actionProviderMock.getWorkingDirectory
      .calledWith()
      .mockReturnValue(MOCKS_FOLDER);

    actionProviderMock.getFolders
      .calledWith()
      .mockReturnValue([FOLDER_NAME1, FOLDER_NAME2]);

    prepareFolder(FOLDER_NAME1, nameKey, nameValue, fileName);
    prepareFolder(FOLDER_NAME2, 'not-name', nameValue, fileName);

    //ACT
    app.main();

    //ASSERT
    expect(actionProviderMock.setOutput).toHaveBeenCalledWith([
      {
        folder: FOLDER_NAME1,
        name: nameValue,
      },
    ]);
  });

  test('Finding app name for a multiple folders - one folder is missing, should return array with folders app names without the missing folder', () => {
    //ARRANGE
    const FOLDER_NAME: string = randomString();
    const fileName = 'package.json';
    actionProviderMock.getWorkingDirectory
      .calledWith()
      .mockReturnValue(MOCKS_FOLDER);

    actionProviderMock.getFolders
      .calledWith()
      .mockReturnValue([FOLDER_NAME, 'missing_folder']);

    prepareFolder(FOLDER_NAME, nameKey, nameValue, fileName);

    //ACT
    app.main();

    //ASSERT
    expect(actionProviderMock.setOutput).toHaveBeenCalledWith([
      {
        folder: FOLDER_NAME,
        name: nameValue,
      },
    ]);
  });
});
