import { Injectable } from "@nestjs/common";
// @ts-ignore: Cannot find module
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SERVICE {
  constructor(private readonly prisma: PrismaService) {}
}
