import { Catch, ArgumentsHost, Inject } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql'
import { Logger } from 'winston';
  
  @Catch()
  export class AllExceptionsFilter implements GqlExceptionFilter  {
    constructor(@Inject('winston') private readonly logger: Logger) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const requestData = this.prepareRequestData(GqlArgumentsHost.create(host).getContext().req);
        this.logger.error("error from filter with context logger", {exception,requestData});
        return exception;
    }

    prepareRequestData(req:any){
        if (!req)  return null;
    
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