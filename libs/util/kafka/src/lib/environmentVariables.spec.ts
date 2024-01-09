import { EnvironmentVariables } from "./environmentVariables";
import { AssertionError } from "assert";

const STRING_ENV_KEY = "STRING_ENV_KEY";
const EMPTY_ENV_KEY = "EMPTY_ENV_KEY";

const STATIC_STRING = `localhost:8080`;

describe("Testing the environmental variables class ", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it("should return a string", () => {
    process.env[STRING_ENV_KEY] = STATIC_STRING;
    const value = EnvironmentVariables.instance.get(STRING_ENV_KEY, true);
    expect(value).toBe(STATIC_STRING);
  });

  describe("Testing the strict mode and errors", () => {
    it("should throw an error for an string that missing", () => {
      try {
        EnvironmentVariables.instance.get(EMPTY_ENV_KEY, true);
      } catch (error) {
        expect(error instanceof AssertionError).toBeTruthy();
      }
    });
  });
});
