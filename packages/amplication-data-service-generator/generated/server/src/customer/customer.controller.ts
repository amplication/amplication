import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { CustomerService } from "./customer.service";
import { CustomerControllerBase } from "./base/customer.controller.base";

@swagger.ApiTags("customers")
@common.Controller("customers")
export class CustomerController extends CustomerControllerBase {
  constructor(protected readonly service: CustomerService) {
    super(service);
  }
}
