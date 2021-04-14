import {
  Configuration,
  DeployResult,
  EnumDeployStatus,
  Variables,
} from "../types";
import { Deployer } from "./Deployer";
import { InvalidDefaultError } from "./InvalidDefaultError";

const EXAMPLE_PROVIDER_NAME = "example";
const INVALID_DEFAULT = "INVALID_DEFAULT";
const EXAMPLE_CONFIGURATION: Configuration = {
  terraform: { backend: {} },
  module: {},
};
const EXAMPLE_VARIABLES: Variables = {};
const EXAMPLE_RESULT: DeployResult = { status: EnumDeployStatus.Completed };

const EXAMPLE_SYNC_PROVIDER = {
  deploy: jest.fn(async () => EXAMPLE_RESULT),
  destroy: jest.fn(async () => EXAMPLE_RESULT),
  getStatus: jest.fn(async () => EXAMPLE_RESULT),
};

const EXAMPLE_ASYNC_PROVIDER = Promise.resolve(EXAMPLE_SYNC_PROVIDER);

describe("Deployer", () => {
  test("builds using a sync provider", async () => {
    await expect(
      new Deployer({
        default: EXAMPLE_PROVIDER_NAME,
        providers: {
          [EXAMPLE_PROVIDER_NAME]: EXAMPLE_SYNC_PROVIDER,
        },
      }).deploy(EXAMPLE_CONFIGURATION, EXAMPLE_VARIABLES)
    ).resolves.toEqual(EXAMPLE_RESULT);
  });
  test("builds using an async provider", async () => {
    await expect(
      new Deployer({
        default: EXAMPLE_PROVIDER_NAME,
        providers: {
          [EXAMPLE_PROVIDER_NAME]: EXAMPLE_ASYNC_PROVIDER,
        },
      }).deploy(EXAMPLE_CONFIGURATION, EXAMPLE_VARIABLES)
    ).resolves.toEqual(EXAMPLE_RESULT);
  });
  test("throws an error for invalid default", () => {
    expect(
      () =>
        new Deployer({
          default: INVALID_DEFAULT,
          providers: {
            [EXAMPLE_PROVIDER_NAME]: EXAMPLE_SYNC_PROVIDER,
          },
        })
    ).toThrow(new InvalidDefaultError(INVALID_DEFAULT));
  });
});
