import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { Customers } from "../dto/Customers";
import { CustomerInput } from "../dto/CustomerInput";
import { Customer } from "../dto/Customer";
import { CustomerService } from "./customer.service";

// @ts-ignore
@Controller("customers")
export class CustomerController {
  constructor(private readonly service: CustomerService) {}
  /** List all customers */
  @Get()
  findMany(
    @Query() query: { email: string; lastName: string; firstName: string }
  ): Promise<Customers> {
    return this.service.findMany({ where: query });
  }
  /** Create a customer */
  @Post()
  create(@Query() query: {}, @Body() data: CustomerInput): Promise<Customer> {
    return this.service.create({ ...query, data });
  }
  /** Info for a specific customer */
  @Get(":id")
  async findOne(
    @Query() query: {},
    @Param()
    params: {
      id: string;
    }
  ): Promise<Customer> {
    const result = await this.service.findOne({ ...query, where: params });
    if (result === null) {
      throw new NotFoundException(
        `No resource was found for ${JSON.stringify(query)}`
      );
    }
    return result;
  }
}
