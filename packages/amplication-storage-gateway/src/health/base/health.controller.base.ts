import {Get, HttpStatus, Inject, Res} from "@nestjs/common";
import { Response } from "express";
import { HealthService } from "../health.service";
import {AmplicationLogger} from "@amplication/nest-logger-module";

export class HealthControllerBase {
  constructor(protected readonly healthService: HealthService,
              protected logger:AmplicationLogger) {}
  @Get("live")
  async healthLive(@Res() response: Response): Promise<Response<void>> {
    try {
      this.logger.info("Check service health")
      await this.healthService.check()
      this.logger.info("Service health - checked")
      return response.status(HttpStatus.NO_CONTENT).send();
    } catch (error){
      this.logger.error("Check service health failed",error)
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
  @Get("ready")
  async healthReady(@Res() response: Response): Promise<Response<void>> {
    this.logger.info("Service is ready")
    return response.status(HttpStatus.NO_CONTENT).send();
  }
}
