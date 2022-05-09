import { EnvironmentVariables } from "./";
import { AssertionError } from "assert";

const ARRAY_ENV_KEY = "ARRAY_ENV_KEY";
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
  it("should return an array", () => {
    process.env[ARRAY_ENV_KEY] = `["localhost:9092","localhost:3000"]`;
    const array = EnvironmentVariables.instance.getJson(ARRAY_ENV_KEY, true);
    expect(Array.isArray(array)).toBe(true);
    expect(array.find((data) => data === "localhost:9092")).toBeTruthy();
    expect(array.find((data) => data === "localhost:3000")).toBeTruthy();
  });

  describe("Testing the strict mode and errors", () => {
    it("should throw an error for an string that missing", () => {
      try {
        EnvironmentVariables.instance.get(EMPTY_ENV_KEY, true);
      } catch (error) {
        expect(error instanceof AssertionError).toBeTruthy();
      }
    });
    it("should throw an error if the value is not json parsed", () => {
      process.env[ARRAY_ENV_KEY] = `[localhost:9092,localhost:3000]`;
      try {
        EnvironmentVariables.instance.getJson(ARRAY_ENV_KEY, true);
      } catch (error) {
        expect(error instanceof SyntaxError).toBeTruthy();
      }
    });
  });
});
