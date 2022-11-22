import { Matcher, mock } from "jest-mock-extended";
import { ResourceService } from "../..";
import { FindOneArgs } from "../../../dto";
import {
  MOCK_SERVICE_RESOURCE_WITHOUT_GITHUB_TOKEN,
  TEST_SERVICE_RESOURCE_MOCK,
} from "./Resource.mock";
import { TEST_RESOURCE_ID } from "./resourceId.mock";

export const mockResourceService = mock<ResourceService>();
mockResourceService.resource
  .calledWith(
    new Matcher<FindOneArgs>((actualValue) => {
      return actualValue.where.id === TEST_RESOURCE_ID;
    }, `Make sure that the id of the resource is ${TEST_RESOURCE_ID}`)
  )
  .mockReturnValue(Promise.resolve(TEST_SERVICE_RESOURCE_MOCK));
mockResourceService.resource
  .calledWith(
    new Matcher<FindOneArgs>((actualValue) => {
      return (
        actualValue.where.id !== TEST_RESOURCE_ID &&
        actualValue.where.id !== MOCK_SERVICE_RESOURCE_WITHOUT_GITHUB_TOKEN.id
      );
    }, `Make sure that the id of the resource is'nt ${TEST_RESOURCE_ID}`)
  )
  .mockReturnValue(Promise.resolve(null));
mockResourceService.resource
  .calledWith(
    new Matcher<FindOneArgs>((actualValue) => {
      return (
        actualValue.where.id === MOCK_SERVICE_RESOURCE_WITHOUT_GITHUB_TOKEN.id
      );
    }, `Make sure that the id of the resource is the one without the github token`)
  )
  .mockReturnValue(Promise.resolve(MOCK_SERVICE_RESOURCE_WITHOUT_GITHUB_TOKEN));
