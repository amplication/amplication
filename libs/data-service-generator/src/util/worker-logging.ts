import winston from "winston";

import Transport from "winston-transport";

type WorkerLoggerOptions = {
  messageFunction: (message: string) => void;
};

class WorkerTransport extends Transport {
  private messageFunction: (message: string) => void;

  constructor(options: WorkerLoggerOptions) {
    super();

    this.messageFunction = options.messageFunction;
  }

  log(info: any, callback: any) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    // Perform the writing to the remote service
    this.messageFunction(info);

    callback();
  }
}

export function createWorkerLogger(
  messageCallback: (message: string) => void
): winston.Logger {
  const options: WorkerLoggerOptions = {
    messageFunction: messageCallback,
  };

  return winston.createLogger({
    transports: [new WorkerTransport(options)],
    format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.simple()
    ),
  });
}
