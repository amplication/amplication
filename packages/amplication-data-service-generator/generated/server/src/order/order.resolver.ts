import * as graphql from "@nestjs/graphql";
import { OrderResolverBase } from "./base/order.resolver.base";
import { Order } from "./base/Order";
import { OrderService } from "./order.service";

@graphql.Resolver(() => Order)
export class OrderResolver extends OrderResolverBase {
  constructor(protected readonly service: OrderService) {
    super(service);
  }
}
