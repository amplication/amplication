import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EmptyServiceBase } from "./base/empty.service.base";

@Injectable()
export class EmptyService extends EmptyServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
