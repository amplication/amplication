import { transports } from "winston";
import {
  LoggerMetadata,
  developmentFormat,
  LEVEL,
  productionFormat,
  winstonConfigFactory,
} from "./config.factory";

describe("WinstonConfigFactory", () => {
  const defaultMeta: LoggerMetadata = { service: "server" };
  it("should return development config if false", () => {
    expect(winstonConfigFactory(false, defaultMeta)).toEqual({
      level: LEVEL,
      format: developmentFormat,
      transports: [expect.any(transports.Console)],
      defaultMeta: defaultMeta,
    });
  });

  it("should return production config if true", () => {
    expect(winstonConfigFactory(true, defaultMeta)).toEqual({
      level: LEVEL,
      format: productionFormat,
      transports: [expect.any(transports.Console)],
      defaultMeta: defaultMeta,
    });
  });
});
