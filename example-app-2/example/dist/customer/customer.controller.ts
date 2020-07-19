import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { CustomerInput } from "../dto/CustomerInput";
import { CustomerService } from "./customer.service";
import { Customer } from "../dto/Customer";

// @ts-ignore
@Controller("customers")
export class CustomerController {
  constructor(private readonly service: CustomerService) {}
  /** List all customers */
  @Get()
  findMany(
    @Query() query: { email: string; lastName: string; firstName: string }
  ): Promise<Customer[]> {
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
    const entity = await this.service.findOne({ ...query, where: params });
    if (entity === null) {
      throw new NotFoundException(
        `No entity was found for ${JSON.stringify(query)}`
      );
    }
    return entity;
  }
}
