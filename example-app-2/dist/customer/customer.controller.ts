import { Controller, Get, Post, Param, Query, Body } from "@nestjs/common";
import { Customer } from "../dto/Customer";
import { CustomerService } from "./customer.service";
import { NotFoundException } from "@nestjs/common";

@Controller("customers")
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  /** List all customers */
  @Get()
  findMany(@Query() query): Promise<Customer[]> {
    return this.service.findMany(query);
  }
  /** Create a customer */
  @Post()
  create(@Query() query, @Body() data): Promise<Customer> {
    return this.service.create({ ...query, data });
  }
  /** Info for a specific customer */
  @Get(":id")
  async findOne(@Query() query, @Param() params): Promise<Customer> {
    const entity = await this.service.findOne({ ...query, where: params });
    if (entity === null) {
      throw new NotFoundException(
        `No entity was found for ${JSON.stringify(query)}`
      );
    }
    return entity;
  }
}
