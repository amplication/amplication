import { Matcher, mock } from 'jest-mock-extended';
import { AppService } from 'src/core';
import { FindOneArgs } from 'src/dto';
import { TEST_APP_ID, TEST_APP_MOCK } from './App.mock';

export const mockAppService = mock<AppService>();
mockAppService.app
  .calledWith(
    new Matcher<FindOneArgs>(actualValue => {
      return actualValue.where.id === TEST_APP_ID;
    }, `Make sure that the name of the repo is "repo"`)
  )
  .mockReturnValue(Promise.resolve(TEST_APP_MOCK));
mockAppService.app
  .calledWith(
    new Matcher<FindOneArgs>(actualValue => {
      return actualValue.where.id !== TEST_APP_ID;
    }, `Make sure that the name of the repo is "repo"`)
  )
  .mockReturnValue(Promise.resolve(null));
