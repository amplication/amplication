import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { OrderControllerBase } from "./base/order.controller.base";

@swagger.ApiTags("orders")
@common.Controller("orders")
export class OrderController extends OrderControllerBase {
  constructor(protected readonly service: OrderService) {
    super(service);
  }
}
