import { transports } from "winston";
import {
  developmentFormat,
  LEVEL,
  productionFormat,
  winstonConfigFactory,
} from "./winstonConfig.factory";

describe("WinstonConfigFactory", () => {
  it("should return development config if false", () => {
    expect(winstonConfigFactory(false)).toEqual({
      level: LEVEL,
      format: developmentFormat,
      transports: [expect.any(transports.Console)],
    });
  });

  it("should return production config if true", () => {
    expect(winstonConfigFactory(true)).toEqual({
      level: LEVEL,
      format: productionFormat,
      transports: [expect.any(transports.Console)],
    });
  });
});
