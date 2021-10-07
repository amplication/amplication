import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { PrismaService } from "nestjs-prisma";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}
  @Get("live")
  healthLive(@Res() response: Response): Response<void> {
    return response.sendStatus(200);
  }
  @Get("ready")
  healthReady(@Res() response: Response): Response<void> {
    this.prisma.user;
    return response.sendStatus(200);
  }
}
