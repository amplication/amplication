import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
declare class SERVICE_BASE {
  protected readonly prisma: PrismaService;
  constructor(prisma: PrismaService);
}

@Injectable()
export class SERVICE extends SERVICE_BASE {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
