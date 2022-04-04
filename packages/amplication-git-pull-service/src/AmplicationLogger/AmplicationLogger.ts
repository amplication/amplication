import { ConsoleLogger, LoggerService } from "@nestjs/common";

export class AmplicationLogger implements LoggerService {
  log(message: any, stack?: string, context?: string) {
    console.log(message, stack, context);
  }

  error(message: any, stack?: string, context?: string) {
    console.log(message, stack, context);
  }

  warn(message: any, stack?: string, context?: string) {
    console.log(message, stack, context);
  }

  debug(message: any, stack?: string, context?: string) {
    console.log(message, stack, context);
  }

  verbose(message: any, stack?: string, context?: string) {
    console.log(message, stack, context);
  }
}
