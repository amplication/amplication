import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { format as winstonFormat, transports } from "winston";
import {
  WinstonModuleOptionsFactory,
  WinstonModuleOptions,
} from "nest-winston";
import { format as winstonCloudLoggingFormat } from "winston-cloud-logging";

export const LEVEL = "info";

/**
 * Defines configuration for logging
 */
@Injectable()
export class WinstonConfigService implements WinstonModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  readonly developmentFormat = winstonFormat.combine(
    winstonFormat.errors({ stack: true }),
    winstonFormat.timestamp(),
    winstonFormat.colorize(),
    winstonFormat.simple()
  );
  readonly productionFormat = winstonFormat.combine(
    winstonFormat.errors({ stack: true }),
    winstonFormat.timestamp(),
    winstonCloudLoggingFormat(),
    winstonFormat.json()
  );
  createWinstonModuleOptions(): WinstonModuleOptions {
    return {
      level: LEVEL,
      format:
        this.configService.get("NODE_ENV") === "production"
          ? this.productionFormat
          : this.developmentFormat,
      transports: [new transports.Console()],
    };
  }
}
