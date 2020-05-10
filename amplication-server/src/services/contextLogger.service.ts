import { Injectable, Inject, Scope, ExecutionContext } from '@nestjs/common';
import { Logger } from 'winston';
import { CONTEXT, GqlExecutionContext } from '@nestjs/graphql';

//@Injectable({ scope: Scope.REQUEST })
@Injectable()
export class ContextLoggerService {
  constructor(
    @Inject('winston') private readonly logger: Logger //@Inject(CONTEXT) private context
  ) {}

  error(message: string, ...meta: any[]) {
    if (this.logger.levels[this.logger.level] >= this.logger.levels['error']) {
      const requestData = this.prepareRequestData();
      this.logger.error(message, { meta, requestData });
    }
  }

  warn(message: string, ...meta: any[]) {
    if (this.logger.levels[this.logger.level] >= this.logger.levels['warn']) {
      const requestData = this.prepareRequestData();
      this.logger.warn(message, { meta, requestData });
    }
  }

  info(message: string, ...meta: any[]) {
    if (this.logger.levels[this.logger.level] >= this.logger.levels['info']) {
      const requestData = this.prepareRequestData();
      this.logger.info(message, { meta, requestData });
    }
  }

  debug(message: string, ...meta: any[]) {
    if (this.logger.levels[this.logger.level] >= this.logger.levels['debug']) {
      const requestData = this.prepareRequestData();
      this.logger.debug(message, { meta, requestData });
    }
  }

  getRequest() {
    return null;
    //return this.context.req;
    // const ctx = GqlExecutionContext.create(this.context);
    // return ctx.getContext().req;
  }

  prepareRequestData() {
    const req = this.getRequest();

    if (!req) return null;

    const query = req && req.body && req.body.query;
    const hostname = req.hostname;
    const ip = req.ip;
    const userId = req.user && req.user.id;

    return {
      query,
      hostname,
      ip,
      userId
    };
  }
}
