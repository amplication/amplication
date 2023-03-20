import winston from "winston";

export const defaultLogger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
  ),
});
