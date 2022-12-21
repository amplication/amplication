import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { OrderServiceBase } from "./base/order.service.base";

@Injectable()
export class OrderService extends OrderServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
