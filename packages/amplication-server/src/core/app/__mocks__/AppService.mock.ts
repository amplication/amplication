import { Matcher, mock } from 'jest-mock-extended';
import { AppService } from 'src/core';
import { FindOneArgs } from 'src/dto';
import { MOCK_APP_WITHOUT_GITHUB_TOKEN, TEST_APP_MOCK } from './App.mock';
import { TEST_APP_ID } from './appId.mock';

export const mockAppService = mock<AppService>();
mockAppService.app
  .calledWith(
    new Matcher<FindOneArgs>(actualValue => {
      return actualValue.where.id === TEST_APP_ID;
    }, `Make sure that the id of the app is ${TEST_APP_ID}`)
  )
  .mockReturnValue(Promise.resolve(TEST_APP_MOCK));
mockAppService.app
  .calledWith(
    new Matcher<FindOneArgs>(actualValue => {
      return (
        actualValue.where.id !== TEST_APP_ID &&
        actualValue.where.id !== MOCK_APP_WITHOUT_GITHUB_TOKEN.id
      );
    }, `Make sure that the id of the app is'nt ${TEST_APP_ID}`)
  )
  .mockReturnValue(Promise.resolve(null));
mockAppService.app
  .calledWith(
    new Matcher<FindOneArgs>(actualValue => {
      return actualValue.where.id === MOCK_APP_WITHOUT_GITHUB_TOKEN.id;
    }, `Make sure that the id of the app is the one without the github token`)
  )
  .mockReturnValue(Promise.resolve(MOCK_APP_WITHOUT_GITHUB_TOKEN));
