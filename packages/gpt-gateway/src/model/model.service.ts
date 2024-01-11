import { PrismaService } from "../prisma/prisma.service";
import { ModelServiceBase } from "./base/model.service.base";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ModelService extends ModelServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
