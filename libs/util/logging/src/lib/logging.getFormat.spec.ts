import { Logger } from "./logging";
import { LoggerOptions, LogLevel } from "./types";
import { format } from "winston";
import { Format } from "logform";

const FORMAT_ERRORS = "errors";
const FORMAT_SPLAT = "splat";
const FORMAT_JSON = "json";
const FORMAT_TIMESTAMP = "timestamp";

describe("getLoggerFormat", () => {
  let options: LoggerOptions;

  let spyOnCombineFormat: jest.SpyInstance;

  beforeEach(() => {
    spyOnCombineFormat = jest
      .spyOn(format, "combine")
      .mockReturnValue({} as unknown as Format);
    jest
      .spyOn(format, "splat")
      .mockReturnValue(FORMAT_SPLAT as unknown as Format);
    jest
      .spyOn(format, "errors")
      .mockReturnValue(FORMAT_ERRORS as unknown as Format);

    jest
      .spyOn(format, "json")
      .mockReturnValue(FORMAT_JSON as unknown as Format);

    jest
      .spyOn(format, "timestamp")
      .mockReturnValue(FORMAT_TIMESTAMP as unknown as Format);

    options = {
      logLevel: LogLevel.Debug,
      component: "Test Service",
      metadata: {},
      additionalFormats: [],
      additionalDevelopmentFormats: [],
      isProduction: false,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns a combined format with errors, timestamp, and custom format when not in production", () => {
    options.isProduction = false;
    new Logger(options);

    expect(spyOnCombineFormat).toHaveBeenCalledWith(
      FORMAT_TIMESTAMP,
      FORMAT_ERRORS,
      { template: expect.any(Function) }
    );
  });

  it("returns a combined format with errors, timestamp, and json when in production", () => {
    options.isProduction = true;
    new Logger(options);

    expect(spyOnCombineFormat).toHaveBeenCalledWith(
      FORMAT_TIMESTAMP,
      FORMAT_ERRORS,
      FORMAT_JSON
    );
  });
});
