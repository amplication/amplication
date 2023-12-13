import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ModelServiceBase } from "./base/model.service.base";

@Injectable()
export class ModelService extends ModelServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
