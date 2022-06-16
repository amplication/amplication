import { Get, HttpStatus, Res } from "@nestjs/common";
import { Response } from "express";
import { HealthService } from "../health.service";

export class HealthControllerBase {
  constructor(protected readonly healthService: HealthService) {}
  @Get("live")
  healthLive(@Res() response: Response): Response<void> {
    return response.status(HttpStatus.NO_CONTENT).send();
  }
  @Get("ready")
  async healthReady(@Res() response: Response): Promise<Response<void>> {
    return response.status(HttpStatus.NO_CONTENT).send();
  }
}
