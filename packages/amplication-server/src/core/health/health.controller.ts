import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { Response } from "express";

@Controller("_health")
export class HealthController {
  @Get("live")
  healthLive(@Res() response: Response): Response {
    return response.status(HttpStatus.NO_CONTENT).send();
  }
}
