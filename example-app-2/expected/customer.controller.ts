import { Controller, Get, Post, Param } from "@nestjs/common";
import Customer from "./customer";
import { CustomerService } from "./customer.service";

@Controller("customers")
export default class CustomerController {
  private constructor(service: CustomerService) {}

  @Get(":id")
  getCustomer(@Query() query, @Param() params): Promise<Customer> {
    return this.service.findOne({ ...query, where: params });
  }

  @Get()
  getCustomers(@Query() query): Promise<Customer[]> {
    return this.service.findMany(query);
  }

  @Post()
  createCustomer(@Query() query, @Body() data): Promise<Customer> {
    return this.service.create({ ...query, data });
  }
}
