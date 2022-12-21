import * as graphql from "@nestjs/graphql";
import { CustomerResolverBase } from "./base/customer.resolver.base";
import { Customer } from "./base/Customer";
import { CustomerService } from "./customer.service";

@graphql.Resolver(() => Customer)
export class CustomerResolver extends CustomerResolverBase {
  constructor(protected readonly service: CustomerService) {
    super(service);
  }
}
