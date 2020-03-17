import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable()
export class ContextLoggerService {
  constructor(@Inject('winston') private readonly logger: Logger) {}


  error(message: string, req: Request, ...meta: any[]) {

    if (this.logger.levels[this.logger.level] >= this.logger.levels['error']){
        const requestData = this.prepareRequestData(req);
        this.logger.error( message, { meta,  requestData});

    }
  }

  warn(message: string, req: Request, ...meta: any[]) {
    
    if (this.logger.levels[this.logger.level] >= this.logger.levels['warn']){
        const requestData = this.prepareRequestData(req);
        this.logger.warn ( message, { meta,  requestData});
    }

  }

  info(message: string, req: Request, ...meta: any[]) {
    if (this.logger.levels[this.logger.level] >= this.logger.levels['info']){
        const requestData = this.prepareRequestData(req);
        this.logger.info( message, { meta,  requestData});
    }
  }


  debug( message: string, req: Request, ...meta: any[]) {
    
    if (this.logger.levels[this.logger.level] >= this.logger.levels['debug']){
        const requestData = this.prepareRequestData(req);
        this.logger.debug( message, { meta,  requestData});
    }

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
